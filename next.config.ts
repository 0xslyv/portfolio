import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin({
  experimental: {
    // Relative path(s) to source files
    srcPath: './src',

    extract: {
      // Defines which locale to extract to
      sourceLocale: 'en'
    },

    messages: {
      // Relative path to the directory
      path: './messages',

      // Either 'json' or 'po'
      format: 'json',

      // Either 'infer' to automatically detect locales based on
      // matching files in `path` or an explicit array of locales
      locales: 'infer'
    }
  }
});

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Config options here
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  outputFileTracingIncludes: {
    '/*': [
      './src/app/[locale]/blog/personal/posts/**/*.mdx',
      './src/app/[locale]/blog/technology/posts/**/*.mdx',
    ],
  },
};
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
})

export default withMDX(withNextIntl(nextConfig));
