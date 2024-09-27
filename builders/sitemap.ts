import GenerateSitemap from 'react-router-sitemap-maker';
import RouterComponentForSitemap from '../src/router/RouterComponentForSitemap';

const sitemapData = GenerateSitemap(RouterComponentForSitemap(), {
	baseUrl: 'https://chat-react.c7pixel.com',
	hashrouting: true,
	changeFrequency: 'monthly',
});

sitemapData.toFile('./dist/sitemap.xml');
