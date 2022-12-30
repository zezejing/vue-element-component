//==本JS是加载Lodop插件及CLodop服务的综合示例，可直接使用，建议看懂后融进自己页面程序==



let CreatedOKLodopObject, CLodopIsLocal, CLodopJsState;

//==判断是否需要CLodop(那些不支持插件的浏览器):==
export function needCLodop() {
  try {
    let ua = navigator.userAgent;
    if (ua.match(/Windows\sPhone/i)) return true;
    if (ua.match(/iPhone|iPod|iPad/i)) return true;
    if (ua.match(/Android/i)) return true;
    if (ua.match(/Edge\D?\d+/i)) return true;

    let verTrident = ua.match(/Trident\D?\d+/i);
    let verIE = ua.match(/MSIE\D?\d+/i);
    let verOPR = ua.match(/OPR\D?\d+/i);
    let verFF = ua.match(/Firefox\D?\d+/i);
    let x64 = ua.match(/x64/i);
    if (!verTrident && !verIE && x64) return true;
    else if (verFF) {
      verFF = verFF[0].match(/\d+/);
      if (verFF[0] >= 41 || x64) return true;
    } else if (verOPR) {
      verOPR = verOPR[0].match(/\d+/);
      if (verOPR[0] >= 32) return true;
    } else if (!verTrident && !verIE) {
      let verChrome = ua.match(/Chrome\D?\d+/i);
      if (verChrome) {
        verChrome = verChrome[0].match(/\d+/);
        if (verChrome[0] >= 41) return true;
      }
    }
    return false;
  } catch (err) {
    return true;
  }
}

//==加载引用CLodop的主JS,用双端口8000和18000(以防其中一个被占):==
export function loadCLodop() {
  if (CLodopJsState == "loading" || CLodopJsState == "complete") return;
  CLodopJsState = "loading";
  let head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  let JS1 = document.createElement("script");
  let JS2 = document.createElement("script");
  JS1.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
  JS2.src = "http://localhost:18000/CLodopfuncs.js";
  JS1.onload = JS2.onload = function () {
    CLodopJsState = "complete";
  };
  JS1.onerror = JS2.onerror = function () {
    CLodopJsState = "complete";
  };
  head.insertBefore(JS1, head.firstChild);
  head.insertBefore(JS2, head.firstChild);
  CLodopIsLocal = !!(JS1.src + JS2.src).match(/\/\/localho|\/\/127.0.0./i);
}

if (needCLodop()) {
  loadCLodop();
} //加载

//==获取LODOP对象主过程,判断是否安装、需否升级:==
export function getLodop(oOBJECT, oEMBED) {
  let strHtmInstall =
    "<font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  let strHtmUpdate =
    "<font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  let strHtm64_Install =
    "<font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
  let strHtm64_Update =
    "<font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
  let strHtmFireFox =
    "<font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
  let strHtmChrome =
    "<font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
  let strCLodopInstall_1 =
    "<font color='#FF00FF'>Web打印服务CLodop未安装启动，点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>下载执行安装</a>";
  let strCLodopInstall_2 =
    "（若此前已安装过，可<a href='CLodop.protocol:setup' target='_self'>点这里直接再次启动</a>）";
  let strCLodopInstall_3 = "，成功后请刷新本页面。</font>";
  let strCLodopUpdate =
    "<font color='#FF00FF'>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
  let LODOP;
  try {
    let ua = navigator.userAgent;
    let isIE = !!ua.match(/MSIE/i) || !!ua.match(/Trident/i);
    if (needCLodop()) {
      try {
        LODOP = getCLodop();
      } catch (err) { }
      if (!LODOP && CLodopJsState !== "complete") {
        if (CLodopJsState == "loading") console.error("网页还没下载完毕，请稍等一下再操作.");
        else console.error("没有加载CLodop的主js，请先调用loadCLodop过程.");
        return;
      }
      if (!LODOP) {
        // document.body.innerHTML =
        //   strCLodopInstall_1 +
        //   (CLodopIsLocal ? strCLodopInstall_2 : "") +
        //   strCLodopInstall_3 +
        //   document.body.innerHTML;

        console.error(
          strCLodopInstall_1 + (CLodopIsLocal ? strCLodopInstall_2 : "") + strCLodopInstall_3
        );

        // Notification({
        //   title: '打印控件未安装',
        //   dangerouslyUseHTMLString: true,
        //   message: strCLodopInstall_1 +
        //     (CLodopIsLocal ? strCLodopInstall_2 : "") +
        //     strCLodopInstall_3,
        //   type: 'warning',
        //   duration: 0
        // })
        return;
      } else {
        if (CLODOP.CVERSION < "4.1.2.2") {
          // Notification({
          //   title: '打印控件需要升级',
          //   dangerouslyUseHTMLString: true,
          //   message: strCLodopUpdate,
          //   type: 'warning',
          //   duration: 0
          // })

          console.error(strCLodopUpdate);

          // alert(strCLodopUpdate, '打印控件需要升级', {
          //   dangerouslyUseHTMLString: true
          // });
          // document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
        }
        // if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED); //清理旧版无效元素
        // if (oOBJECT && oOBJECT.parentNode)
        //   oOBJECT.parentNode.removeChild(oOBJECT);
      }
    } else {
      var is64IE = isIE && !!ua.match(/x64/i);
      //==如果页面有Lodop就直接使用,否则新建:==
      if (oOBJECT || oEMBED) {
        if (isIE) LODOP = oOBJECT;
        else LODOP = oEMBED;
      } else if (!CreatedOKLodopObject) {
        LODOP = document.createElement("object");
        LODOP.setAttribute("width", 0);
        LODOP.setAttribute("height", 0);
        LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
        if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
        else LODOP.setAttribute("type", "application/x-print-lodop");
        document.documentElement.appendChild(LODOP);
        CreatedOKLodopObject = LODOP;
      } else LODOP = CreatedOKLodopObject;
      //==Lodop插件未安装时提示下载地址:==
      if (!LODOP || !LODOP.VERSION) {
        if (ua.indexOf("Chrome") >= 0) {
          // Notification({
          //   title: '打印控件未安装',
          //   dangerouslyUseHTMLString: true,
          //   message: strHtmChrome,
          //   type: 'warning',
          //   duration: 0
          // })

          console.error(strHtmChrome);

          // alert(strHtmChrome, '打印控件未安装', {
          //   dangerouslyUseHTMLString: true
          // });
        }
        // document.body.innerHTML = strHtmChrome + document.body.innerHTML;
        if (ua.indexOf("Firefox") >= 0) {
          // Notification({
          //   title: '打印控件未安装',
          //   dangerouslyUseHTMLString: true,
          //   message: strHtmFireFox,
          //   type: 'warning',
          //   duration: 0
          // })

          console.error(strHtmFireFox);

          // alert(strHtmFireFox, '打印控件未安装', {
          //   dangerouslyUseHTMLString: true
          // });
        }
        // document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
        // document.body.innerHTML =
        //   (is64IE ? strHtm64_Install : strHtmInstall) + document.body.innerHTML;

        // Notification({
        //   title: '打印控件未安装',
        //   dangerouslyUseHTMLString: true,
        //   message: is64IE ? strHtm64_Install : strHtmInstall,
        //   type: 'warning',
        //   duration: 0
        // })

        console.error(is64IE ? strHtm64_Install : strHtmInstall);

        // alert(is64IE ? strHtm64_Install : strHtmInstall, '打印控件未安装', {
        //   dangerouslyUseHTMLString: true
        // });
        return LODOP;
      }
    }
    if (LODOP.VERSION < "6.2.2.6") {
      if (!needCLodop()) {
        // Notification({
        //   title: '打印控件需要升级',
        //   dangerouslyUseHTMLString: true,
        //   message: is64IE ? strHtm64_Update : strHtmUpdate,
        //   type: 'warning',
        //   duration: 0
        // })

        console.error(is64IE ? strHtm64_Update : strHtmUpdate);

        // alert(is64IE ? strHtm64_Update : strHtmUpdate, '打印控件需要升级', {
        //   dangerouslyUseHTMLString: true
        // });
      }

      // document.body.innerHTML =
      //   (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML;
    }
    //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==
    if (process.env.VUE_APP_MODE == "production") {
      // 正式
      LODOP.SET_LICENSES("", "955255C6A162297CD54125FBD0DF28344B5", "", "");
    } else {
      // 测试
      LODOP.SET_LICENSES("", "195C0D28A94560FDB1C5E6A2BCC8CF12", "", "");
    }
    //=======================================================
    return LODOP;
  } catch (err) {
    alert("getLodop出错:" + err);
  }
}
