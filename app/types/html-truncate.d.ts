declare module "html-truncate" {
  function truncateHtml(
    html: string,
    length: number,
    options?: {
      stripTags?: boolean;
      ellipsis?: string;
      keepWhitespaces?: boolean;
    }
  ): string;
  export = truncateHtml;
}
