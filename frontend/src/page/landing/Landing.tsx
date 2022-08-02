import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FaceIcon from '@mui/icons-material/Face';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import classNames from 'classnames';
import style from './Landing.module.scss';

const Landing = () => (
  <div className={style.self}>
    <div className={classNames(style.goal, style.green)}>
      <div className={style.header}>活動目的</div>
      <div className={style.flex}>
        <div>
          <CompareArrowsIcon fontSize="large" />
          <div>增加星兒更多的社會互動</div>
        </div>
        <div>
          <MusicNoteIcon fontSize="large" />
          <div>提供家人適時的喘息服務</div>
        </div>
        <div>
          <FaceIcon fontSize="large" />
          <div>提供想認識星兒的人互動機會</div>
        </div>
      </div>
    </div>
    <div className={classNames(style.how, style.blue)}>
      <div className={style.header}>活動方式</div>
      <h3>參加活動</h3>
      <ol>
        <li>點進出遊清單</li>
        <li>選擇喜歡的活動報名參加</li>
        <li>報名截止抽籤後收到活動通知 (集合時間地點等資訊)</li>
      </ol>
      <hr />
      <h3>舉辦活動</h3>
      <ol>
        <li>在出遊清單頁面點選「舉辦出遊」</li>
        <li>填寫活動資訊</li>
        <li>管理員審核通過後開放報名</li>
      </ol>
      <hr />
      <h3>其他說明</h3>
      <ol>
        <li>任何人都可以舉辦活動、參加活動，家長也可幫小孩報名</li>
        <li>不收額外費用，僅須負擔自己的交通、飲食、門票等必要開銷</li>
        <li>
          若您想規劃活動，但沒有想法，可以聯絡
          <a href="https://lin.ee/gk8ydMG">星遊 LINE 官方帳號</a>，我們會和您一起討論規劃
        </li>
        <li>
          更多內容請點進
          <a href="https://www.celestialstudio.net/2022/04/lucky-star-faq.html">常見問題 FAQ</a>
        </li>
      </ol>
    </div>
    <div className={classNames(style.more, style.orange)}>
      <div className={style.header}>瞭解更多</div>
      <p>
        <b>FB 粉專</b>: 我們會在 FB 粉專中分享新的出遊資訊、分享出遊紀錄 →
        <a href="https://www.facebook.com/108515795231766">點我</a>←
      </p>
      <hr />
      <p>
        <b>LINE 社群</b>: 我們會在星遊社群中分享新的出遊資訊、分享出遊紀錄 →
        <a href="https://line.me/ti/g2/khrNOdt3pqlSu7_GafcgrA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default">
          點我
        </a>
        ←
      </p>
      <hr />
      <p>
        <b>星遊官方帳號</b>: 若您有任何問題，歡迎透過 LINE 官方帳號詢問 →
        <a href="https://lin.ee/gk8ydMG">點我</a>←
      </p>
    </div>
  </div>
);

export default Landing;
