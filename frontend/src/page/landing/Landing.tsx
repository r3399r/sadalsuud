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
          增加星兒更多的社會互動
        </div>
        <div>
          <MusicNoteIcon fontSize="large" />
          提供家人適時的喘息服務
        </div>
        <div>
          <FaceIcon fontSize="large" />
          提供想認識星兒的人互動機會
        </div>
      </div>
    </div>
    <div className={classNames(style.how, style.blue)}>
      <div className={style.header}>活動方式</div>
      <p>
        到出遊清單選一個喜歡的活動報名參加，和好夥伴一同度過美好的時光。所有活動皆可自由報名，家長也可幫小孩報名。家長若不放心，可選擇一同參與，若有認識的夥伴，可以交給他並讓自己趁機放個小假。
      </p>
      <p>
        所有活動皆須通過管理員審核才會刊出，聯絡方式只會讓活動負責人知道，確切的時間地點亦只有參與者知悉，費用除了交通、飲食、門票等的必要開銷之外不收額外費用。
      </p>
      <p>需有適當權限才能刊出活動，若您想規劃活動，請聯絡官方客服，我們會盡速與您討論。</p>
    </div>
    <div className={classNames(style.more, style.orange)}>
      <div className={style.header}>瞭解更多</div>
      <p>
        星遊社群: 我們會在星遊社群中即時分享新的出遊資訊、抽籤結果等等 →
        <a href="https://line.me/ti/g2/khrNOdt3pqlSu7_GafcgrA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default">
          點我
        </a>
        ←
      </p>
      <hr />
      <p>
        星遊官方帳號: 若您有任何問題，歡迎透過 LINE 官方帳號詢問。 →
        <a href="https://lin.ee/gk8ydMG">點我</a>←
      </p>
    </div>
  </div>
);

export default Landing;
