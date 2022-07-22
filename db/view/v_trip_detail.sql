DROP VIEW IF EXISTS v_trip_detail;
CREATE VIEW v_trip_detail AS
select tmp.id,
    tmp.uuid,
    tmp.topic,
    tmp.meet_date,
    tmp.owner_name,
    tmp.owner_phone,
    tmp.owner_line,
    tmp.code,
    tmp.status,
    count(sign_id) as count,
    tmp.date_created,
    tmp.date_updated
from (
        select trip.id,
            trip.uuid,
            trip.topic,
            trip.meet_date,
            trip.owner_name,
            trip.owner_phone,
            trip.owner_line,
            trip.code,
            trip.status,
            trip.date_created,
            trip.date_updated,
            sign.id as sign_id
        from trip
            left join sign on trip.id = sign.trip_id
    ) as tmp
group by tmp.id;