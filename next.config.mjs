/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/UI/stylesheets')],
    additionalData: `
      @import "_mixins.scss";
			@import "_variables.scss";
    `
  }
};

export default nextConfig;
