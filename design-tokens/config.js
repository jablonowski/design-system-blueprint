module.exports = {
    "source": ["tokens/**/*.json"],
    "platforms": {
      "css": {
        "prefix": "ds",
        "transformGroup": "css",
        "buildPath": "dist/css/",
        "files": [
          {
            "destination": "variables.css",
            "format": "css/variables",
            "options": { "outputReferences": true },
          },
        ],
      },
      "scss": {
        "transformGroup": "scss",
        "buildPath": "dist/scss/",
        "files": [
          {
            "destination": "_variables.scss",
            "format": "scss/variables",
            "options": { "outputReferences": true },
          },
        ],
      },
      "js": {
        "transformGroup": "js",
        "buildPath": "dist/js/",
        "files": [
          {
            "destination": "tokens.js",
            "format": "javascript/es6",
          },
        ],
      },
      "ts": {
        "transformGroup": "js",
        "buildPath": "dist/ts/",
        "files": [
          {
            "destination": "tokens.ts",
            "format": "javascript/es6",
          },
          {
            "destination": "tokens.d.ts",
            "format": "typescript/es6-declarations",
          },
        ],
      },
      "json": {
        "transformGroup": "js",
        "buildPath": "dist/json/",
        "files": [
          {
            "destination": "tokens.json",
            "format": "json/nested",
          },
        ],
      },
    },
}