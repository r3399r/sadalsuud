var AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-northeast-1' })

var dynamoDb = new AWS.DynamoDB()
var env = process.argv[2]
var table = `celestial-db-${env}`

var main = async () => {
    const res = await dynamoDb.query({
        TableName: table,
        ExpressionAttributeValues: { ":v1": { S: "S0#trip" } },
        KeyConditionExpression: "pk = :v1",
    }).promise()

    for (const item of res.Items) {
        const r = await dynamoDb.query({
            TableName: table,
            ExpressionAttributeValues: { ":v1": { S: item.sk.S } },
            KeyConditionExpression: "pk = :v1",
        }).promise()
        for (const sign of r.Items) {
            if (sign.attribute !== undefined && sign.attribute.S === 'signId#many') {
                await dynamoDb.deleteItem({
                    TableName: table,
                    Key: {
                        "pk": { S: sign.pk.S },
                        "sk": { S: sign.sk.S }
                    }
                }).promise()
                await dynamoDb.updateItem({
                    TableName: table,
                    ExpressionAttributeNames: {
                        "#att": "attribute"
                    },
                    ExpressionAttributeValues: {
                        ":t": { S: "tripId#one" }
                    },
                    Key: {
                        "pk": { S: sign.sk.S },
                        "sk": { S: sign.pk.S }
                    },
                    ReturnValues: "ALL_NEW",
                    UpdateExpression: "SET #att = :t"
                }).promise()
            }
        }
    }
}

main()