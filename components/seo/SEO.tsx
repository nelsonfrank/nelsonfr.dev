// dependencies
import Head from "next/head";

interface SEOPropsType {
  title: string;
  description?: string;
  article?: string;
  url?: string;
  image?: string;
  twitterHandle?: string;
}
const SEO = ({
  title,
  description,
  article,
  url,
  image,
  twitterHandle,
}: SEOPropsType) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {url && <meta property="og:url" content={url} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && <meta name="twitter:creator" content={twitterHandle} />}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
};

export default SEO;
