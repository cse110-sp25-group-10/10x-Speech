/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-recommended"],
  "plugins": [
		"@stylistic/stylelint-plugin"
	],
  rules: {
    // !important
    "declaration-no-important": true,

    // CSS Comments
    "comment-no-empty": true,
    "comment-whitespace-inside": "always",

    // Declaration Stops
    "@stylistic/declaration-block-trailing-semicolon": "always",

    // Rule Separation
    "rule-empty-line-before": ["always", {
      except: ["first-nested"],
      ignore: ["after-comment"]
    }],

    // Double Quotes around Values (kind of)
    "@stylistic/string-quotes": "double",

    // Shorthand vs Longhand (kind of)
    "shorthand-property-no-redundant-values": true,
  },
};