// Packages
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name='msapplication-TileColor' content='#0B0E15' />
          <meta name='theme-color' content='#ffffff' />
          <meta property='og:type' content='website' />
          <meta
            name='description'
            content='Testnet: Fundraising dApp on Sepolia Network.'
          />
          <meta
            property='og:title'
            content='Testnet: Fundraising dApp on Sepolia Network.'
          />
          <meta
            property='og:description'
            content='Testnet: Fundraising dApp on Sepolia Network.'
          />
          <meta
            name='twitter:title'
            content='Testnet: Fundraising dApp on Sepolia Network.'
          />
          <meta
            name='twitter:description'
            content='Testnet: Fundraising dApp on Sepolia Network.'
          />
          <meta
            property='og:image'
            content='https://i.ibb.co/wzJKnvW/og-banner.jpg'
          />
          <meta name='twitter:card' content='summary_large_image' />
          <meta property='twitter:domain' content='https://thedailylion.com/' />
          <meta
            name='twitter:image'
            content='https://i.ibb.co/wzJKnvW/og-banner.jpg'
          />
          <meta name='twitter:card' content='summary_large_image' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/favicon/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon/favicon-32x32.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='16x16'
            href='/favicon/favicon-16x16.png'
          />
          <link rel='manifest' href='/favicon/site.webmanifest' />
          <link
            rel='mask-icon'
            href='/favicon/safari-pinned-tab.svg'
            color='#5bbad5'
          />
          <meta name='msapplication-TileColor' content='#ffffff' />
          <meta name='theme-color' content='#ffffff' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
