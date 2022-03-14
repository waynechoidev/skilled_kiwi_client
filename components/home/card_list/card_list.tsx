import Link from 'next/link';

interface Card {
  bg: string;
  msg: Function;
}

export const cardList: Card[] = [
  {
    bg: '/img/card/01.jpg',
    msg: () => (
      <div>
        I need a hand.
        <br />
        <b>Skilled hands!</b>
        <div>
          <Link href="/post_request">
            <a href="/post_request">
              <button>Find Someone to help</button>
            </a>
          </Link>
        </div>
      </div>
    ),
  },
  {
    bg: '/img/card/02.jpg',
    msg: () => (
      <div>
        <b>Skilled Kiwis</b>
        <br />
        help each other
        <br />
        in the community
        <div>
          <Link href="/find_requests">
            <a href="/find_requests">
              <button>Find Requests</button>
            </a>
          </Link>
          <Link href="/post_request">
            <a href="/post_request">
              <button>Post a Request</button>
            </a>
          </Link>
        </div>
      </div>
    ),
  },
  {
    bg: '/img/card/03.jpg',
    msg: () => (
      <div>
        Earn extra income
        <br />
        in your spare time.
        <br />
        <b>We need you!</b>
        <div>
          <Link href="/find_requests">
            <a href="/find_requests">
              <button>Make extra money</button>
            </a>
          </Link>
        </div>
      </div>
    ),
  },
];
