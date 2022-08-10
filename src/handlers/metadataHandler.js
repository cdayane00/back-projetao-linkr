import urlMetadata from "url-metadata";

export async function useMetadata(url) {
  let result;
  await urlMetadata(url).then(
    (metadata) => {
      if (metadata.image.length === 0) {
        result = {
          metaTitle: metadata.title,
          metaText: metadata.description,
          metaImage:
            "https://neilpatel.com/wp-content/uploads/2019/05/ilustracao-panda-com-problema-error-404-not-found.jpeg",
          metaUrl: metadata.url,
        };
      } else {
        result = {
          metaTitle: metadata.title,
          metaText: metadata.description,
          metaImage: metadata.image,
          metaUrl: metadata.url,
        };
      }
    },
    (error) => {
      result = error;
    }
  );
  return result;
}
