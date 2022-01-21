export interface Card {
  bg: string;
  msg: Function;
}

export const cardList: Card[] = [
  {
    bg: '/img/card01.jpg',
    msg: () => (
      <div>
        I need a hand.
        <br />
        <b>Skilled hands!</b>
        <div>
          <button>Find Someone to help</button>
        </div>
      </div>
    ),
  },
  {
    bg: '/img/card02.jpg',
    msg: () => (
      <div>
        <b>Skilled Kiwis</b>
        <br />
        help each other
        <br />
        in the community
        <div>
          <button>Find Requests</button>
          <button>Post a Request</button>
        </div>
      </div>
    ),
  },
  {
    bg: '/img/card03.jpg',
    msg: () => (
      <div>
        Earn extra income
        <br />
        in your spare time.
        <br />
        <b>We need you!</b>
        <div>
          <button>Make extra money</button>
        </div>
      </div>
    ),
  },
];