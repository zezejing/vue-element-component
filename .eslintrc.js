module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": 2, // 禁止出现未使用过的变量
    "no-var": 2, // 要求使用 let 或 const 而不是 var
    "no-shadow": 1, // 禁止变量声明与外层作用域的变量同名
    "no-use-before-define": 0, // 禁止在变量定义之前使用它们
    "quotes": ["error", "double"], // 双引号
    "comma-dangle": ["error", "never"], // 末尾禁止逗号
    "linebreak-style": ["error", "unix"], // 换行符 lf
    "max-len": ["error", { tabWidth: 2, code: 100 }], // 一行最大长度，超出换行
    "semi": ["error", "always"], // 表达式必须加分号
    "quote-props": ["error", "consistent"],
    "object-curly-spacing": ["error", "always"],
    "vue/multi-word-component-names": 0 // 组件是否必须需要名字
  }
};
