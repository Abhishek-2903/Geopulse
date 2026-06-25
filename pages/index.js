import Head from "next/head";

export default function Maintenance() {
  return (
    <>
      <Head>
        <title>Under Maintenance — GeoPulse</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            height: 100%;
            background: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
              system-ui, sans-serif;
            -webkit-font-smoothing: antialiased;
          }

          @keyframes sweep {
            0%   { transform: translateX(-120%); }
            100% { transform: translateX(520%); }
          }

          @keyframes rise {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0; }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          .page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
          }

          .card {
            width: 100%;
            max-width: 500px;
            text-align: center;
            animation: rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .brand {
            font-size: 0.68rem;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            color: #999;
            margin-bottom: 1.8rem;
          }

          .rule {
            width: 36px;
            height: 1px;
            background: #0a0a0a;
            margin: 0 auto 2.4rem;
          }

          .icon-wrap {
            margin-bottom: 2.4rem;
          }

          .gear {
            animation: spin 8s linear infinite;
            transform-origin: center;
          }

          .heading {
            font-size: clamp(1.8rem, 5vw, 2.8rem);
            font-weight: 700;
            letter-spacing: -0.04em;
            color: #0a0a0a;
            line-height: 1.1;
            margin-bottom: 1.25rem;
          }

          .cursor {
            display: inline-block;
            width: 3px;
            height: 0.9em;
            background: #0a0a0a;
            margin-left: 4px;
            vertical-align: middle;
            animation: blink 1s step-end infinite;
          }

          .body {
            font-size: 0.97rem;
            line-height: 1.75;
            color: #5a5a5a;
            margin-bottom: 2.8rem;
          }

          .track {
            width: 160px;
            height: 1.5px;
            background: #e5e5e5;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
          }

          .runner {
            position: absolute;
            left: 0;
            top: 0;
            width: 20%;
            height: 100%;
            background: #0a0a0a;
            animation: sweep 1.8s ease-in-out infinite;
          }
        `}</style>
      </Head>

      <div className="page">
        <div className="card">

          <p className="brand">GeoPulse</p>
          <div className="rule" />

          <div className="icon-wrap">
            <svg
              width="38"
              height="38"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="gear"
              aria-hidden="true"
            >
              <path
                d="M20 13a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm0 11.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Z"
                fill="#0a0a0a"
              />
              <path
                d="M38.1 16.6l-2.6-.7a16 16 0 0 0-.9-2.1l1.4-2.3a1.25 1.25 0 0 0-.2-1.6l-3.7-3.7a1.25 1.25 0 0 0-1.6-.2l-2.3 1.4a16 16 0 0 0-2.1-.9l-.7-2.6A1.25 1.25 0 0 0 24.2 3h-5.2c-.6 0-1.1.4-1.2 1l-.7 2.6a16 16 0 0 0-2.1.9L12.7 6a1.25 1.25 0 0 0-1.6.2L7.4 9.9a1.25 1.25 0 0 0-.2 1.6l1.4 2.3a16 16 0 0 0-.9 2.1l-2.6.7c-.6.1-1 .6-1 1.2v5.2c0 .6.4 1.1 1 1.2l2.6.7c.3.8.6 1.5.9 2.1L7.2 29a1.25 1.25 0 0 0 .2 1.6l3.7 3.7a1.25 1.25 0 0 0 1.6.2l2.3-1.4c.7.3 1.4.6 2.1.9l.7 2.6c.1.6.6 1 1.2 1h5.2c.6 0 1.1-.4 1.2-1l.7-2.6c.8-.3 1.5-.6 2.1-.9l2.3 1.4a1.25 1.25 0 0 0 1.6-.2l3.7-3.7a1.25 1.25 0 0 0 .2-1.6l-1.4-2.3c.3-.7.6-1.4.9-2.1l2.6-.7c.6-.1 1-.6 1-1.2v-5.2c-.1-.6-.5-1.1-1.1-1.2Zm-1.4 5.6-2.4.6c-.5.1-.9.5-1 1a13.5 13.5 0 0 1-1.3 3.1c-.3.4-.2 1 .1 1.4l1.3 2.1-2.6 2.6-2.1-1.3a1.25 1.25 0 0 0-1.4-.1 13.5 13.5 0 0 1-3.1 1.3c-.5.1-.9.5-1 1l-.6 2.4h-3.6l-.6-2.4c-.1-.5-.5-.9-1-1a13.5 13.5 0 0 1-3.1-1.3 1.25 1.25 0 0 0-1.4.1l-2.1 1.3-2.6-2.6 1.3-2.1c.3-.4.3-1 .1-1.4a13.5 13.5 0 0 1-1.3-3.1c-.1-.5-.5-.9-1-1l-2.4-.6v-3.6l2.4-.6c.5-.1.9-.5 1-1 .3-1.1.7-2.1 1.3-3.1.3-.4.2-1-.1-1.4L5.5 11l2.6-2.6 2.1 1.3c.4.3 1 .3 1.4.1 1-.6 2-1 3.1-1.3.5-.1.9-.5 1-1l.6-2.4h3.6l.6 2.4c.1.5.5.9 1 1 1.1.3 2.1.7 3.1 1.3.4.3 1 .2 1.4-.1l2.1-1.3 2.6 2.6-1.3 2.1c-.3.4-.3 1-.1 1.4.6 1 1 2 1.3 3.1.1.5.5.9 1 1l2.4.6v3.6Z"
                fill="#0a0a0a"
              />
            </svg>
          </div>

          <h1 className="heading">
            We&rsquo;re Upgrading
            <span className="cursor" aria-hidden="true" />
          </h1>

          <p className="body">
            Our website is currently under maintenance.<br />
            Sorry for the inconvenience — we&rsquo;ll be<br />
            back soon, better and faster.
          </p>

          <div className="track" role="progressbar" aria-label="Loading">
            <div className="runner" />
          </div>

        </div>
      </div>
    </>
  );
}
