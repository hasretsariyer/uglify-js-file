const Uglify = require("./uglify");

const paths = {
    components: "components",
    constants: "constants",
    duck: "duck",
    lib: "lib",
    other: "other",
    pages: "pages",
    router: "router",
    services: "services",
    sf_modules: "sf_modules",
    library: "node_modules/library",
    utils: "utils",
    ui: "ui",
    stores: "stores"
};

const keeps = {
    // "/home/ubuntu/workspace/scripts/router/index": true
};

const prefix = "handm-";

Uglify({ paths, keeps, prefix});