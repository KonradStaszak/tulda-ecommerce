# Tulda storefront

## SPA routing in production

The storefront uses React Router with browser-history URLs. Production hosting must serve `index.html` as a fallback for unknown application paths, while still serving real static assets normally. This lets direct visits and refreshes work for routes such as `/products/clearcoats` and `/product/example-product`.

Do not redirect those paths to `/`; the server should return the Vite application shell and let React Router resolve the route.
