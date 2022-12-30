module.exports = {
  title: "vue-element组件库",
  logo: "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png",

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {number} 1 | 2 | 3
   * @description settings siderbar type
   */
  typeSiderbar: 1,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether need isCollapse
   */
  isCollapse: true,

  /**
   * @type {boolean} true | false
   * @description Whether need breadcrumb
   */
  breadcrumb: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {boolean} true | false
   * @description Whether need isVersion
   */
  isVersion: true,

  /**
   * @type {boolean} true | false
   * @description Whether need isFooter
   */
  isFooter: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: "production"
};
