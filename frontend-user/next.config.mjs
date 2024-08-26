/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "picsum.photos",
                port: '',
                protocol: 'https'
            }
        ]
    }
};

export default nextConfig;
