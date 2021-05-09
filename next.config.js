const withPlugins = require("next-compose-plugins");
const transpileModules = require("next-transpile-modules")([
  "three",
  "@react-three/drei",
  "@react-three/fiber",
  "@react-three/cannon",
]);

module.exports = {
  ...withPlugins([transpileModules]),
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: "empty",
      };
    }

    return config;
  },
};
