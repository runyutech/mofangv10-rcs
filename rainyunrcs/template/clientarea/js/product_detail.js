const template = document.getElementsByClassName("common_product_detail")[0];
Vue.prototype.lang = Object.assign(window.lang, window.module_lang);

var osInfoMap = {
  debian:{
      name: "Debian",
      logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAqFBMVEUAAAADAAEMAAMIAAKlAC8GAAIPAAQ3AA8oAAunAC9oAB1JABWhAC5kABxLABUvAA0iAAp0ACFeABtDABMsAAwTAAWUACqSACl6ACJbABpXABhHABQ8ABEaAAcXAAYKAAOjAC6bACyPACmCACU/ABIzAA6fAC1/ACRtAB5SABclAAsdAAidAC2aACyIACdxACBOABYgAAmXACuLACd3ACKFACaWACuoADDVP6CqAAAAN3RSTlMABRMN+wkXVDz9nm/0l3JINLCQZkMd4d25ioRsWycjD/js2cZhTvLBpX05LO7pz6x4MObUtcrkXYQQeAAAAxlJREFUWMPtltmWojAQhsMuKCIubArt0u771v/7v9mYlpFjIEiPuZg5Z/4bj0n5WamqpIr8k5Jk7V1EEkb7qLs6KkSX38B0XRNUfuBvxmrQUf4MY+zAaNZOiCz91JsrCmSe0Gj9KLxtcDWzq6Ns5lTqrPH0NZKqubPAQ5vQWR/pz+TVYLF5LF+0Khz3YT8KP552pnOkCpQfcIbuKrc7mKWb85c+WamlbxQGIh6n+/YLTi212/U4Br2v1GJaypFP93pxB1yT9SYNoF4GWoLqa1XqdFoLFs8gToi2pRYTnZSqnpZTwvsnhfSpgfuy3Cb3rC65Bn3qdMBwOBnZJGGHt/9BOROmQLgurT8GZWffFsRH77T39nJNMnVoiHprjj+E1togj7GGOC3a9mS+ztZMasp5NFtd3GSwy0cP1upeY5/Z5hiY1UlxFDR6Oc45f7aek5Xrw4cAQIsUp0XaFJxMuniFB2gCaJNiOTTU7H/YQ/Y5zKJ94IDo6xqyN1TlFN1nyf0/AOiycLPHB6mcPXo9YqYiZkEut9nRJoQPUpiehGYukg/31YgParA9EgY/oH6Lf0H8XCTqHOOIJkbigiY5j+Zs1aafC6Cv8EH73HPhMeWQZkNpYKTIpDJIUc3kqc7r2n3dBiLCAzUBl12bI+TkRdWJxgflqsbAKO21Sb2ZvVQLjDs01Nxi9XJN7ILF7+KMM0sVA8LXFECNadCa7qFT0LJ2tRLQEWAL2Ynl1tB8XtRd4FI6Qmgq0Mm9mkltC0vP8midAPtFnzkDV3ZNcqbxGbNo/U3pHjxgZFSYQ/yCHrbv0qnIC4L5EEAjlF+PscUjRm8/6dhXCsHJ/awyIssqsIuL+otdryly0qs8Z7sAzKgwEc7y0J9WBn03NjUm74u22pEjANTETW+CsnHE1wSQDrjpKAAknelYLwkg1QD6BAmQBSASAZK/AHUlgnRsAJ4ugjQ1gZFGBJXlkohQG1ANXYhPJuDLIkjG8EaaiiCttsCCiJBsmbg6ighU7QyM+yJIUn0MM5SIEK+sxs6QhaAUp2m1P1sa+a+/SL8Ao8GEb5laAHYAAAAASUVORK5CYII=`
  },
  ubuntu:{
      name: "Ubuntu",
      logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAA0lBMVEUAAACrOA9AFQYIAgHaRxTVRRPRRBPNQxO4PBGmNg+JLAx+KQt6KAtyJQpuJApjIAlNGQdEFgY1EQUqDgQkDAMZCAIDAQAyEAUxEATdSBT////53dPvqZD//Pv76uTuoIXeTRr99PD539bsl3njZzzfUyLfUB7++fjgVib88e3zvKnwrpf20ML2zL3hWiv99vT42MzytaDqjm3mdU7lcEjiYTTzv63upYv87ur649vrknPog2DogV3meFLka0HtnIDpiWjpiGbhXjD0w7L0wrHzvqs9zM58AAAAGXRSTlMAxkoJ+/by7NTAnpKNhIByWU49MSkdBDo5kanQzQAAAmRJREFUWMPs1GtT2kAYBeAGFblfRKHnJQJJSCBcRUCLVGtt+///Urubhr6by4LUT47PF4ZhOJM9ObOfPrw/J41atVIqVaq1xsnxIfViDkyuWD8m7KKQRUy2cPHKmIyBFEbmFTGXeWjkLw+MaZZPoXVabh6Sc2VgL+Nqf07rHAc4b+1t+QzpvOWji8BZZk+Orp7vFtHACYvSJrV0z7MiaRs+02dNz9p+fpB0s+sptfGmgSTucDYUnxuS5ggZaSsoI+bJnPr0hz+5xZSkNnbKKXuOFf3Ypp0OtiQ5bJnJG89D5WJ9Tf/c4l58XYDJJ755qLodD2MWNFih7zhPUCRtwADX+0lkYmixpGtzDcx64IyE+weKX+KffThEN6OxeWcHh7R8uoMifj8VwN2TMEHv4QXSsNuhQBdcIXavZsEsKdDnhw0LW4LJRm/fOrh2UMozFNtBOCSmHgkqgnkg6SsinsMhMMVIUA6MTcICMSYJNphcpCIw/WDKHmI8P1Yd1JIaYLokfAOj/mSCaShBNUgvo4099lzZ9QwJ3L+zYGpKUBXC2pIV9Fb82lFt5KnBVJWgCoRpOLk28QVzi8Hc8r/w+ipKUAnCnKQJRkoPeqW3Dvr/ox1Xtq0rm7/+35MjPfrJSpD2WBIkOVlEwQJnFqE805JTjDhiK0bIKNhsCBdslBe1hAt/PQKFP6HqSAu5OjLXklbHXx1RXkHSpsqmvBFBebOG5IaWhS7hhhblTT/KG6OUNY9t4M1jmjfYCXchVI1tNRBdCAJAgrhOjQR9ulmUd/wo74pS3jmmvLtO+QAC5UMao2DYAQA5Ph/5k6wPsgAAAABJRU5ErkJggg==`
  },
  centos:{
      name: "Centos",
      logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAABL1BMVEUAAAAICAgsLCv7+/n6+frb5rvUts/w8+rbvdDt27y8utDw3rrv6e69vs/18eoqKio0MzNRUVHn5+x0dHMxMjH08vX4+PLp6e7o6O3y8enS0t/k0N/n7tH06NHw6u/o6O3IyNjdxtjg6cfw4cfX5Lm6uc7s2rl3dnYbGxsZGRm+v8+TInkmJXeczSrvpyS83W30w2n///9sbKT2++23aqW1Z6OoTZNRUJKv11TyuE7s7PP+9+y6canA33f1x3P8/Pv16/NqaaL6+vv9/fn27PN0dKj+/f2WKHwtLHufzzDvqit3dqrr6vL99+qlR5BLSo6t1U78+fvytknytUfvqCdzc6i5udOamsDf77v647m8dqzR6Jz41pnC4Hv1yXfcuNTas9HOm8LNmMFzcqdpaaH4z9o6AAAAK3RSTlMACC38/Pf29vf39vb29vYrNVH0dTL7+/b19fn5+fn39vT09PTx8PB5Gxn3Nks69gAAAuNJREFUWMPl2OlT00AYx/ESCvXAHvZAOZT7sOm2T8t9NJjaiCIIWrnB8///G8yTSn+7iWmaSV8ww/fVvsh8JrPPTmY2sYedpvXJIdL64iTr9aTWF0cISNEcSNEcSJEdll6mojqQIjvhpQG5dPL2I9cSouUsbpM55YEuDg1KkdXgqCJEhQzOorgUDfhDg6VOx7Xd9mKIoUdFp529o2KneDAEBxCkEBAcQJDCQHAAQQoBWeclN9TpuxUC2qiV/aCVd2shIEiA4PQIHVsbkADJzhodBUPHtfMaJECys/dj7ygI4nmVIQGSnVWeXXfImTskQKpTZKkrxI4sAVIdlrpAOWJHkQApDkuU9nNSIwYjqnQHwbnLGNX8nEtAkNoQnE4nB6//K2kjO+8BQZpgaBwOoP3fkBSnCEiSGtdCXJ/AkSD92wtIkgNIlmYKlUphGo4MQZIdQIo0lyXKDsORIVsa1dwOQzSkNtGYmaNMOp2h4emT8WE1YkhvypL2yna4FXc/84uZpVhsKbOYP6u6Y0eRNLIdn1baxy5Nf3S/mqSFgaq+0AFD2CKnVXe/8tnMciy2nMnmz966++dgcNJmP1EbM6fm25u9MNuYfKxG+3Dc4zd1perWuq7P8/gXhNjcrgglY5+d53AgAYKjTxXK5cKsgASInRQMSIDgrJtXpdJVYxMSIDguCRCcrbGyfcQntyEBguOSLk2vU33G0NOKVzI8Dg644XX0NiS8kgHHXZqaHucO8kh1yvl//M1PTZcDyCXVDwcH/KH4Z5YUBxAkx/naFdJZgqNCkNgR3SFbOoWjQpAubCcAsiULjgpBsmwnCOLgAFKklgiG4HghSL1C1qnuB4kLq9UzxLPzg+qHX0K8ESRAcEJAkADBCQVBegMIThBEcWSSYXLEEDU4S730APJKcrnEzQeuZOcsbhI+16ygUondktRuIvy1FlIkB2mQ4ESQ4ESS4ESV4ESVbOc+/fZxfkQ96P4CtU2u+e2WjYAAAAAASUVORK5CYII=`
  },
  windows:{
      name: "Windows",
      logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOdSURBVHhe7ZtNaBNREMe7+dhN+pGvpjVpWtsmjWILgi0ievFS6kWkFFEUvHgRPejNgyfBQ9VTqxfFgyfBm4IgFunBi7di68WbWDyIoqK20lrTXWfeTjZbmu4mko/dZH5hmXlvZ7d9f2behrx9LQzDMAzDMAxTDIlsw+JV2sJKNJUNxHr36DaVFRaOxdmpGIXtSEMI5JGD7YFIz5ACgw9EQQiTCL7WcBeFbWPh1oTt+F0jkMenBJVoMpMfuAIZISwc/vZYksLKwnUCSV6frESSaUMEtFQacijeCxEV/X8dKZDk8fnlUPduJZJIr3x8+0rbzG20JfceHDxx7bESTgyABh4KrTp1E8irtIaUMGZCTwYyIiNjVoDFNooDGngxbnFmKrr5Z/VHaGB0PHv65ktxcQ2pnkAwQn97Z1IMOiJEMATAzPAFw3GKtKRhBOoem7xM2SCEkMOJQY9PDtDp/8YNApVU733jl2ZRpHDm0PFA5+59lRDHLdRsQiyKVPuHRLnUVyAXwALZwALZwALZwALZUFeB4CHGTzG3U6JAmkZO08EZZAMLZEN9BZJ4knY9pQmkwadJ4QyygQWyoaRJcvTqixzMpx5N01T4SgQFBxYdTYU2flQVahD7weh94hwYjMVItNRGhP/u4cUDufWV722p4cP9x67c12Px+oIV90YLjuhT1c0dz5n7THbrfQt9y3MzF2iIDFMlSiqx4fP3lvBLC5aFnqLiQFf3C/1Yafl0pvICHzoprRFREui/fzZ9Vt1YWw3G+0diI+Pn9L+G4H10hyx2CR9vqrdN54w+4zqA4i3iPr1+dEO0LShjDtLXsipJflUjkj0ymZm6/oS6a0bFVjWaGacIZCoDZ8EZZEN9Bcqvi22ZXJ2FIzLIeDI5EC4xG5whEJeYe6mrQKZlH84gt+IQgXgOsoYnaffiCIEgfTiDisLrYiXi9jno6+LzByvLb+Y3fn7+AIPBXwibhrJTHPdTyKFd/fm36MWL5LjJRLxQnkjjphMKtWXpzsl4bu3Xt9Dg2ET21PQcddeMOmxFkCTceVN4655EJDF9wVAnBQqaUCBrxOY2k3hfFp7eVf+u/+7o2380e+b2fDV+97bCcQJZYewCivYM4REQNjUEQsKRTGNpU2jFcJVAVmBm+Tu6egvCoWiQheSXM++ZaRiBrKF5zxCPso58rxzsoMBtNIlAVkgS7lk1hENL4gWgXcqmXoZhGIZhGIYpQkvLP8gRrggNN7NPAAAAAElFTkSuQmCC`
  },
  rocky_linux:{
      name: "RockyLinux",
      logo: `data:image/png;base64,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`
  },
  alpine_linux:{
      name: "AlpineLinux",
      logo: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAwCAMAAACCABLMAAAByFBMVEUAAAAAAAAAgIAAVVUAQIAAVYAASW0AYIAaTYAXXXQVVYASW4ARVXcQYIAPWngOVYANXnkNWYALWXoLVYAKWIAJVXsJW4AJWHsRVYAQWnsQWIAPXXwPWoAPV3wOXIANV4ANWYAMWX0MV4ALW30LWYALV30LWoAPV4APWn0PWIAOWoAOWH0NW30NWYAMWX0MWIALWoAPV4AOWn4NWH4MWoAMWX4MWH4OWIAOWYAOWH4OWoANWoANWn4NWYANWH4MWX4MWn4MWYAMWH4OWX4OWH4NWYANWX4NWIANWX4NWYANWX4NWoAMV34MWX4MWn4MWH4OWoAOWIAOWn8OWYANWX8NWX8NWYANWYANWoAMWYAMWH8OWX8OWIAOWn8NWH8NWX8NWYANWX8NWoANWX8MWYAMWn8OWYANWX8NWYANWX8NWoANWX8MWYANWYANWX8NWX8NWIANWH8NWYANWYAOWX8NWYANWYANWYANWX8NWX8NWYANWH8NWYANWX8NWIANWYAMWn8OWYANWX8NWYANWX8NWYANWX8NWYANWYANWX8NWYANWX8NWYANWX8NWX8MWn8NWX8NWYANWX8NWYANWX8NWX4NWX/////m88n2AAAAlnRSTlMAAQIDBAYHCAoLDA4PEBESExQXGBobHB0eHyAhIiMkJigrLC0uLzAyMzQ2Nzs8P0BERkdRUlNXWlxdXmBjZGVnaWprbXFyc3R1dnl6e3t9f4CCg4SHiYqMjpCTlZaXmZ2goaKjpKWqq6y1tre6vr/DxMfIzM/Q1NbX2drb3N3e4OHi4+Tn6Onq7O3u7/Dx8/X3+vv8/f6/1q+aAAAAAWJLR0SX5m4brwAAAkhJREFUSMet1ulb00AQB+BfoYgXFkXE2yKgiLeiiAdVvK2oiFrUetSrIngDSgUBUStVpAUyf68fJpvsNtkk5XE+ZXefN7vdTGcXkKPjoz46oI3INOnj92qte0BekdSx+jlPN9+kcQPkHa/d2RHyi1Y3tuSLr/ta6eK6yD/iTlYzE8D9XetwTyhIpIpZ80IgZ+xWWegdBYv3IcW1Fw3PamG7zJZOqoO5Xd06N7Vccj3qWLYJuC0an4tgj83Wq8vKNgDAHW70V15QXX6T5V4qAz8beKuSzICLKkwLtl/p/rFd7PFDZg54gMfLhxRWby2j7Fm/mZCXFDccBgDElO3axu8CAITPrTRfcU2BMQCoyko937YCAFZ9OM38fMSEl2U3HQHQK3VMbuEcH6aFUyasNsvKdRn2AtGC3RzfDACoHSESMHz1z0knLETxym5NMKv5xCl8hmd8avCacUOCA+iznsc28GyZBLfFjM/NBxn22escrTPZrQpSYHnKAQtRa18y6wSDcAKWPRKwy94XrPhORDRSa/62BGxHBhf30D2jkyFnTrbK+u7pap4t3yY7mm8DgNDxghEDABzKWd/dzLOZuwd3Hh0losGze6WNm4vvaO4cJCIj0dJ44g0REQ1xNmGPQSXFPpHA6ZLYCyvx62ZLYPmN9h/+ZgmuW65LE4HZ1DKvOqiPY2rdfbu4uhu4zrcUHxCpQO6x4zxas8hzDPEA7orLeVuR8WVjbuc0Wn3d4f96D/G99zTqLkxJT3dff6/75cFy+ntdCffIfzIU1LzRvMcmAAAAAElFTkSuQmCC`
  },
  mac_o_s:{
      name: "MacOS",
      logo: `data:image/png;base64,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`
  }
};


const clientOperateVue = new Vue({
  components: {
    asideMenu,
    topMenu,
    pagination,
    payDialog,
    discountCode,
    cashBack,
    safeConfirm,
    hostStatus,
    autoRenew,
    renewDialog,
    unsubscribe
  },
  created() {
    const params = getUrlParams();
    this.id = params.id * 1;
    this.getCommonData();
    this.getDetail();
    this.getComDetail();
    this.getCountryList();
    this.getRenewPrice();
    this.getCloudStatus();
  },
  mounted() {
    this.addons_js_arr = JSON.parse(
      document.querySelector("#addons_js").getAttribute("addons_js")
    ); 
    const arr = this.addons_js_arr.map((item) => {
      return item.name;
    });
    if (arr.includes("PromoCode")) {
      
      this.isShowPromo = true;
      this.getPromo();
    }
    if (arr.includes("IdcsmartClientLevel")) {
      
      this.isShowLevel = true;
    }

    if (arr.includes("IdcsmartRefund")) {
      this.hasRefundPlugin = true;
      this.getRefundInfo();
    }
    if (arr.includes("IdcsmartRenew")) {
      this.hasRenewPlugin = true;
      this.getRenewStatus();
    }
    window.reshHtml = this.handleClick;
  },
  updated() {
    // 关闭loading
    // document.getElementById('mainLoading').style.display = 'none';
    // document.getElementsByClassName('common_product_detail')[0].style.display = 'block'
  },
  destroyed() { },
  data() {
    return {
      initLoading: true,
      hasRefundPlugin: false,
      hasRenewPlugin: false,
      baseUrl: url,
      id: "",
      client_operate_password: "",
      product_id: "",
      renewLoading: false,
      pro_base_price: 0,

      commonData: {},
      payWay: {
        free: lang.free,
        onetime: lang.onetime,
        recurring_prepayment: lang.recurring_prepayment,
        recurring_postpaid: lang.recurring_postpaid,
      },
      countryList: [],
      configoptions: [], // 配置
      status: {
        Unpaid: {
          text: lang.common_cloud_text88,
          color: "#F64E60",
          bgColor: "#FFE2E5",
        },
        Pending: {
          text: lang.common_cloud_text89,
          color: "#3699FF",
          bgColor: "#E1F0FF",
        },
        Active: {
          text: lang.common_cloud_text90,
          color: "#1BC5BD",
          bgColor: "#C9F7F5",
        },
        Suspended: {
          text: lang.common_cloud_text91,
          color: "#F0142F",
          bgColor: "#FFE2E5",
        },
        Deleted: {
          text: lang.common_cloud_text92,
          color: "#9696A3",
          bgColor: "#F2F2F7",
        },
        Failed: {
          text: lang.common_cloud_text93,
          color: "#FFA800",
          bgColor: "#FFF4DE",
        },
      },
      // 停用状态
      refundStatus: {
        Pending: lang.common_cloud_text234,
        Suspending: lang.common_cloud_text235,
        Suspend: lang.common_cloud_text236,
        Suspended: lang.common_cloud_text237,
        Refund: lang.common_cloud_text238,
        Reject: lang.common_cloud_text239,
        Cancelled: lang.common_cloud_text240,
      },
      isShowPass: false,
      /* 停用相关 */
      isStop: false,
      noRefundVisible: false,
      refundVisible: false,
      refundInfo: {}, //商品停用信息
      refundForm: {
        str: "",
        arr: [],
        type: "Immediate", // Expire, Immediate
      },
      refundMoney: "0.00",
      refundDialog: {},
      // 续费
      renewActiveId: "0",
      // 显示续费弹窗
      isShowRenew: false,
      customfield: {},
      // 续费页面信息
      renewPageData: [],
      addons_js_arr: [], // 插件列表
      isShowPromo: false, // 是否开启优惠码
      isShowLevel: false, // 是否开启等级优惠
      isUseDiscountCode: false, // 是否使用优惠码
      // 续费参数
      renewParams: {
        id: 0,
        duration: "", // 周期
        billing_cycle: "", // 周期时间
        clDiscount: 0, // 用户等级折扣价
        code_discount: 0, // 优惠码折扣价
        original_price: 0, // 售卖价格
        base_price: 0, // 原价
        totalPrice: 0, // 应支付价格
      },
      /* 备注 */
      isShowNotesDialog: false,
      host: {},
      hostData: {},
      hidenPass: false,
      self_defined_field: [],
      notesValue: "",
      promo_code: [],
      loading: false,
      // 自动续费
      isShowPayMsg: 0,
      autoTitle: "",
      dialogVisible: false,
      /* 升降级 */
      upgradeLoading: false,
      upLicenseDialogShow: false,
      selectUpIndex: 0,
      buy_id: "",
      upPriceLoading: false,
      licenseActive: "1",
      upData: {
        price: 0,
        clDiscount: 0,
        totalPrice: 0,
        code_discount: 0,
      },
      isShowUp: true,
      upBtnLoading: false,
      upgradeHost: {},
      upgradeConfig: [],
      upgradeSon_host: [],
      upgradeList: [],
      basicInfo: {},
      configForm: {},
      upSon: [],
      curCycle: 0,
      curCountry: {},
      firstInfo: [],
      renewPriceList: [],
      filterCountry: {},
      // filterCountry: [],
      /* 升降级 end */

      activeName: "0",
      startTime: 0,
      addonsArr: [],
      configLimitList: [], // 限制规则
      configObj: {},
      backup_config: [],
      snap_config: [],
      cpu_realData: {},
      // 是否救援系统
      isRescue: false,
      cloudConfig: {},
      // 实例详情
      cloudData: {
        data_center: {
          iso: "CN",
        },
        image: {
          icon: "",
        },
        config: {
          reinstall_sms_verify: 0,
          reset_password_sms_verify: 0,
        },
        package: {
          cpu: "",
          memory: "",
          out_bw: "",
          system_disk_size: "",
        },
        system_disk: {},
        iconName: "Windows",
      },
      // 显示重装系统弹窗
      isShowReinstallDialog: false,
      // 重装系统弹窗内容
      reinstallData: {
        osGroupId: "",
        osId: "",
      },
      selectOsObj: {},
      // 镜像版本选择框数据
      osSelectData: [],
      // 镜像图片地址
      osIcon: "",
      // Shhkey列表
      sshKeyData: [],
      // 错误提示信息
      errText: "",
      // 镜像是否需要付费
      isPayImg: false,
      payMoney: 0,
      // 镜像优惠价格
      payDiscount: 0,
      // 镜像优惠码价格
      payCodePrice: 0,
      onOffvisible: false,
      rebotVisibel: false,
      codeString: "",
      isShowIp: false,
      // 管理开始
      // 开关机状态
      powerStatus: "",
      consoleList: [],
      powerList: [],
      // 重置密码弹窗数据
      rePassData: {
        password: "",
      },
      codeTimer: null,
      sendTime: 60,
      isSendCodeing: false,
      sendFlag: false,
      // 是否展示重置密码弹窗
      isShowRePass: false,
      // 救援模式弹窗数据
      rescueData: {
        type: "1",
        password: "",
      },
      // 是否展示救援模式弹窗
      isShowRescue: false,
      // 是否展示退出救援模式弹窗
      isShowQuit: false,
      ipValue: null,

      netLoading: false,
      netDataList: [],
      netParams: {
        page: 1,
        limit: 20,
        pageSizes: [20, 50, 100],
        total: 200,
        orderby: "id",
        sort: "desc",
        keywords: "",
      },
      elasticLoading: false,
      elasticParams: {
        page: 1,
        limit: 20,
        pageSizes: [20, 50, 100],
        total: 0,
      },
      elasticList: [],
      // 网络流量
      flowData: {},
      // 备份列表数据
      dataList1: [],
      // 快照列表数据
      dataList2: [],
      backLoading: false,
      snapLoading: false,
      params1: {
        page: 1,
        limit: 20,
        pageSizes: [20, 50, 100],
        total: 200,
        orderby: "id",
        sort: "desc",
        keywords: "",
      },
      params2: {
        page: 1,
        limit: 20,
        pageSizes: [20, 50, 100],
        total: 200,
        orderby: "id",
        sort: "desc",
        keywords: "",
      },
      // true 标记为备份  false 标记为快照
      isBs: true,
      // 弹窗表单数据
      createBsData: {
        id: 0,
        name: "",
        disk_id: 0,
      },
      // 实例磁盘列表
      // 是否显示弹窗
      isShwoCreateBs: false,
      cgbsLoading: false,
      isShowhyBs: false,
      safeDialogShow: false,
      // 还原显示数据
      restoreData: {
        restoreId: 0,
        // 实例名称
        cloud_name: "",
        // 创建时间
        time: "",
      },
      // 是否显示删除快照弹窗
      isShowDelBs: false,
      // 删除显示数据
      delData: {
        delId: 0,
        // 实例名称
        cloud_name: "",
        // 创建时间
        time: "",
        // 快照名称
        name: "",
      },
      bsDataLoading: false,
      // 获取快照/备份升降级价格 参数 生成快照/备份数量升降级订单参数
      bsData: {
        id: 0,
        type: "",
        backNum: 0,
        snapNum: 0,
        money: 0,
        moneyDiscount: 0,
        codePrice: 0,
        duration: lang.common_cloud_text110,
      },
      // 是否显示开启备份弹窗
      isShowOpenBs: false,
      // 快照备份订单id
      bsOrderId: 0,
      chartSelectValue: "1",
      // 统计图表开始
      echartLoading1: false,
      echartLoading2: false,
      echartLoading3: false,
      echartLoading4: false,
      isShowPowerChange: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      powerTitle: "",
      diskPriceLoading: false,
      ipPriceLoading: false,
      ipMoney: 0.0,
      ipDiscountkDisPrice: 0.0,
      ipCodePrice: 0.0,
      upgradePriceLoading: false,
      trueDiskLength: 0,
      isShowAutoRenew: false,
      vpcDataList: [],
      vpcLoading: false,
      vpcParams: {
        page: 1,
        limit: 20,
        pageSizes: [20, 50, 100],
        total: 200,
        orderby: "id",
        sort: "desc",
        keywords: "",
      },
      isShowengine: false,
      engineID: "",
      curEngineId: "",
      engineSearchLoading: false,
      productOptions: [],
      consoleData: {},
      productParams: {
        page: 1,
        limit: 20,
        keywords: "",
        status: "Active",
        orderby: "id",
        sort: "desc",
        data_center_id: "",
      },
      isShowAddVpc: false,
      plan_way: 0,
      vpc_ips: {
        vpc1: {
          tips: lang.range1,
          value: 10,
          select: [10, 172, 192],
        },
        vpc2: 0,
        vpc3: 0,
        vpc3Tips: "",
        vpc4: 0,
        vpc4Tips: "",
        vpc6: {
          value: 16,
          select: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
        },
        min: 0,
        max: 255,
      },
      vpcName: "",
      ips: "",
      safeOptions: [],
      safeID: "",
      cpuName: "",
      memoryName: "",
      bwName: "",
      flowName: "",
      defenseName: "",
      memoryList: [],
      cpuList: [],
      memoryArr: [], // 范围时内存数组
      activeName1: "custom", // fast, custom
      memoryType: false,
      memoryTip: "",
      params: {
        // 配置参数
        data_center_id: "",
        cpu: "",
        memory: 1,
        image_id: 0,
        system_disk: {
          size: "",
          disk_type: "",
        },
        data_disk: [],
        backup_num: "",
        snap_num: "",
        line_id: "",
        bw: "",
        flow: "",
        peak_defence: "",
        ip_num: "",
        duration_id: "",
        network_type: "normal",
        // 提交购买
        name: "", // 主机名
        ssh_key_id: "",
        /* 安全组 */
        security_group_id: "",
        security_group_protocol: [],
        password: "",
        re_password: "",
        vpc: {
          // 新建-系统分配的时候都不传
          id: "", // 选择已有的vc
          ips: "", // 自定义的时候
        },
        notes: "",
      },
      lineDetail: {}, // 线路详情：bill_type, flow, bw, defence , ip
      memory_unit: "",
      // 流量包
      showPackage: false,
      packageLoading: false,
      packageList: [],
      curPackageId: "",
      /* 转发建站 */
      aclLoading: false,
      webLoading: false,
      aclList: [],
      webList: [],
      protocolArr: [
        { value: 1, label: "TCP" },
        { value: 2, label: "UDP" },
        { value: 3, label: "TCP+UDP" },
      ],
      natDialog: false,
      natType: "", // acl, web
      natForm: {
        name: "",
        int_port: undefined,
        protocol: "",
        domain: "",
      },
      submitLoaing: false,
      /* NAT转发管理 */
      natList: [],
      natPublicIp: '',
      natLoading: false,
      natDialogVisible: false,
      natSubmitting: false,
      natManageForm: {
        port_out: undefined,
        port_in: undefined,
        port_type: 'tcp',
      },
      natRules: {
        name: [
          {
            required: true,
            message: `${lang.placeholder_pre1}${lang.security_label1}`,
            trigger: "blur",
          },
        ],
        domain: [
          {
            required: true,
            message: `${lang.placeholder_pre1}${lang.domain}`,
            trigger: "blur",
          },
        ],
        int_port: [
          {
            required: true,
            message: `${lang.placeholder_pre1}${lang.int_port}`,
            trigger: "blur",
          },
        ],
        protocol: [
          {
            required: true,
            message: `${lang.placeholder_pre2}${lang.protocol}`,
            trigger: "change",
          },
        ],
      },
      chartData: [],
      client_area: [],
      client_button: {},
      osData: {},
      osList: [],
      // 重装系统标签页
      reinstallExpandedGroup: '',
      reinstallSelectedOsId: null,
      reinstallConfirm: false,
      reinstallResetOsd: false,
      reinstallLoading: false,
      reinstallErrText: '',
      statusText: "",
      postPowerStatus: "",
      // 镜像
      osGroupId: "",
      firstDueTime: 0,
      isExclude: 0,
      cascadeStates: {},
      cascadeTimers: {},
    };
  },
  mixins: [mixin],
  filters: {
    formateTime(time) {
      if (time && time !== 0) {
        return formateDate(time * 1000);
      } else {
        return "--";
      }
    },
    filterMoney(money) {
      if (isNaN(money) || money * 1 < 0) {
        return "0.00";
      } else {
        return formatNuberFiexd(money);
      }
    },
  },
  computed: {
    calcSwitch() {
      return (item) => {
        return item.subs.map((el) => el.id).sort((a, b) => a - b);
      };
    },
    calcCountry() {
      return (val) => {
        return this.countryList.filter((item) => val === item.iso)[0]?.name_zh;
      };
    },
    calcCity() {
      return (id) => {
        return this.filterCountry[id].filter(
          (item) => item[0]?.country === this.curCountry[id]
        )[0];
      };
    },
    showRenewPrice() {
      let p = this.hostData.renew_amount;
      this.renewPriceList.forEach((item) => {
        if (
          item.billing_cycle === this.hostData.billing_cycle_name &&
          this.hostData.renew_amount * 1 < item.price * 1
        ) {
          p = item.price * 1;
        }
      });
      return p;
    },
    osIconUrl() {
      const osInfoIconKeyMap = {
        'windows': 'windows', 'centos': 'centos', 'ubuntu': 'ubuntu',
        'debian': 'debian', 'rocky': 'rocky_linux', 'alpine': 'alpine_linux',
        'macos': 'mac_o_s',
      };
      const osInfo = this.host?.os_info || {};
      const icon = (osInfo.icon || '').toLowerCase();
      const mapKey = osInfoIconKeyMap[icon];
      if (mapKey && osInfoMap[mapKey] && osInfoMap[mapKey].logo) {
        return osInfoMap[mapKey].logo;
      }
      return '';
    },
    powerStatusHtml() {
      let status = '';
      if (this.postPowerStatus === 'on') {
        status = 'running';
      } else if (this.postPowerStatus === 'off') {
        status = 'stopped';
      } else {
        status = this.host?.status_api || 'stopped';
      }
      if (this.statusText) {
        if (this.statusText === '运行中') status = 'running';
        else if (this.statusText === '启动中') status = 'booting';
        else if (this.statusText === '创建中') status = 'creating';
        else if (this.statusText === '停止中') status = 'stopping';
        else if (this.statusText === '已暂停') status = 'suspended';
        else status = 'stopped';
      }
      const statusHtmlMap = {
        'running': '<i class="fas fa-circle-play" style="color:#22c55e"></i><span> 运行中</span>',
        'booting': '<i class="fas fa-circle-play" style="color:#22c55e"></i><span> 启动中</span>',
        'creating': '<i class="fas fa-circle-notch fa-spin" style="color:#22c55e"></i><span> 创建中</span>',
        'stopping': '<i class="fas fa-circle-stop" style="color:#ef4444"></i><span> 停止中</span>',
        'stopped': '<i class="fas fa-circle-stop" style="color:#ef4444"></i><span> 已关机</span>',
        'banned': '<i class="fas fa-circle-stop" style="color:#ef4444"></i><span> 已停止</span>',
        'suspended': '<i class="fas fa-circle-stop" style="color:#ef4444"></i><span> 已暂停</span>',
      };
      return statusHtmlMap[status] || statusHtmlMap['stopped'];
    },
    reinstallOsGroups() {
      const filtered = this.osList.filter(os => {
        return os.is_available === true &&
               !os.name.toLowerCase().includes('gpu') &&
               !os.name.toLowerCase().includes('btpanel');
      });
      const logoOrder = {
        debian: 1, ubuntu: 2, centos: 3, windows: 4,
        rocky_linux: 5, alpine_linux: 6, mac_o_s: 7
      };
      const grouped = filtered.reduce((acc, item) => {
        const icon = item.icon || 'unknown';
        if (!acc[icon]) acc[icon] = [];
        acc[icon].push(item);
        return acc;
      }, {});
      Object.values(grouped).forEach(items => {
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
      });
      const result = Object.entries(grouped).map(([icon, items]) => ({
        icon, items,
        osInfo: osInfoMap[icon] || { name: icon }
      }));
      result.sort((a, b) => {
        const orderA = logoOrder[a.icon] || Infinity;
        const orderB = logoOrder[b.icon] || Infinity;
        return orderA - orderB;
      });
      return result;
    },
  },
  watch: {
    renewParams: {
      handler() {
        let n = 0;
        // l:当前周期的续费价格
        const l = this.hostData.renew_amount;
        if (this.isShowPromo && this.customfield.promo_code) {
          // n: 算出来的价格
          n =
            (this.renewParams.base_price * 1000 -
              this.renewParams.clDiscount * 1000 -
              this.renewParams.code_discount * 1000) /
              1000 >
              0
              ? (this.renewParams.base_price * 1000 -
                this.renewParams.clDiscount * 1000 -
                this.renewParams.code_discount * 1000) /
              1000
              : 0;
        } else {
          //  n: 算出来的价格
          n =
            (this.renewParams.original_price * 1000 -
              this.renewParams.clDiscount * 1000 -
              this.renewParams.code_discount * 1000) /
              1000 >
              0
              ? (this.renewParams.original_price * 1000 -
                this.renewParams.clDiscount * 1000 -
                this.renewParams.code_discount * 1000) /
              1000
              : 0;
        }
        let t = n;
        // 如果当前周期和选择的周期相同，则和当前周期对比价格
        if (
          this.hostData.billing_cycle_time === this.renewParams.duration ||
          this.hostData.billing_cycle_name === this.renewParams.billing_cycle
        ) {
          console.log(n > l);
          // 谁大取谁
          t = n;
        }
        this.renewParams.totalPrice =
          t * 1000 > 0 ? ((t * 1000) / 1000).toFixed(2) : 0;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {

    // #region ============== 级联 ==============
    // ==================== 回填方法 ====================
    /**
     * 回填级联选中状态
     * @param {Object} savedData  { "36800": { "item_id": "19", "quantity": 8 } }
     */
    restoreCascadeSelections(savedData) {
      if (!savedData || typeof savedData !== 'object') return;
      this.configoptions.forEach(item => {
        if (item.option_type !== 'cascade') return;
        if (!savedData[item.id]) return;
        const { item_id, quantity } = savedData[item.id];
        const targetItemId = Number(item_id);
        // 从树中找到目标叶子节点的完整路径
        const path = this.findPathInTree(item.tree, targetItemId);
        if (!path || path.length === 0) return;
        // 回填选中状态
        const ids = path.map(node => node.item_id);
        const items = path.map(node => node);
        const state = this.cascadeStates[item.id];
        if (!state) {
          this.$set(this.cascadeStates, item.id, {
            selectedIds: ids,
            selectedItems: items,
            quantity: quantity || 1
          });
        } else {
          this.$set(state, 'selectedIds', ids);
          this.$set(state, 'selectedItems', items);
          this.$set(state, 'quantity', quantity || 1);
        }
      });
      this.backups.cascade_configoption = this.getAllCascadeResults();
    },

    /**
     * 在树中递归查找目标 item_id 的完整路径
     * @param {Array} tree - 树数据
     * @param {Number} targetItemId - 目标叶子节点的 item_id
     * @returns {Array|null} - 从根到叶子的节点数组，找不到返回 null
     */
    findPathInTree(tree, targetItemId) {
      if (!tree || tree.length === 0) return null;
      for (const node of tree) {
        // 当前节点就是目标
        if (node.item_id === targetItemId) {
          return [node];
        }
        // 递归查找子节点
        if (node.children && node.children.length > 0) {
          const childPath = this.findPathInTree(node.children, targetItemId);
          if (childPath) {
            // 找到了，把当前节点加到路径前面
            return [node, ...childPath];
          }
        }
      }
      return null;
    },
    // 初始化所有 cascade 类型的选项
    initAllCascade() {
      this.configoptions.forEach(item => {
        if (item.option_type === 'cascade' && item.tree && item.tree.length > 0) {
          this.initCascadeState(item.id, item.tree);
        }
      });
    },
    // 初始化单个 cascade 的状态：默认每层选中第一项
    initCascadeState(optionId, tree) {
      const ids = [];
      const items = [];
      let currentLevel = tree;
      while (currentLevel && currentLevel.length > 0) {
        const firstItem = currentLevel[0];
        ids.push(firstItem.item_id);
        items.push(firstItem);
        if (firstItem.is_leaf === 1) break;
        currentLevel = firstItem.children || [];
      }
      // 计算默认数量
      const lastItem = items[items.length - 1];
      let quantity = 1;
      if (lastItem && lastItem.is_leaf === 1 && lastItem.fee_type !== 'fixed') {
        const ranges = this.extractValidRanges(lastItem);
        if (ranges.length > 0) {
          quantity = ranges[0].min || 1;
        }
      }
      // 用 $set 保证响应式
      this.$set(this.cascadeStates, optionId, {
        selectedIds: ids,
        selectedItems: items,
        quantity: quantity
      });
    },
    // ==================== 获取状态 ====================
    getCascadeSelectedIds(optionId) {
      const state = this.cascadeStates[optionId];
      return state ? state.selectedIds : [];
    },
    getCascadeSelectedItems(optionId) {
      const state = this.cascadeStates[optionId];
      return state ? state.selectedItems : [];
    },
    // ==================== 计算展示层级 ====================
    getCascadeDisplayLevels(optionId) {
      const configItem = this.configoptions.find(c => c.id === optionId);
      if (!configItem || !configItem.tree || configItem.tree.length === 0) return [];
      const selectedIds = this.getCascadeSelectedIds(optionId);
      const levels = [];
      levels.push(configItem.tree);
      let currentItems = configItem.tree;
      for (let i = 0; i < selectedIds.length; i++) {
        const selectedId = selectedIds[i];
        const selectedItem = currentItems.find(item => item.item_id === selectedId);
        if (selectedItem && selectedItem.children && selectedItem.children.length > 0) {
          levels.push(selectedItem.children);
          currentItems = selectedItem.children;
        } else {
          break;
        }
      }
      return levels;
    },

    // ==================== 叶子节点相关 ====================
    getCascadeLeafNode(optionId) {
      const items = this.getCascadeSelectedItems(optionId);
      if (items.length === 0) return null;
      const last = items[items.length - 1];
      return last && last.is_leaf === 1 ? last : null;
    },
    getCascadeLeafFeeType(optionId) {
      const leaf = this.getCascadeLeafNode(optionId);
      if (!leaf) return 'fixed';
      return leaf.fee_type || 'fixed';
    },
    // ==================== 区间相关 ====================
    // 从叶子节点提取合法区间
    extractValidRanges(leafNode) {
      if (!leafNode || !leafNode.price || leafNode.price.length === 0) return [];
      return leafNode.price
        .map(p => ({
          min: p.qty_min,
          max: p.qty_max,
          priceItem: p
        }))
        .filter(r => r.min > 0 || r.max > 0)
        .sort((a, b) => a.min - b.min);
    },

    getCascadeValidRanges(optionId) {
      const leaf = this.getCascadeLeafNode(optionId);
      return this.extractValidRanges(leaf);
    },

    getCascadeTotalMin(optionId) {
      const ranges = this.getCascadeValidRanges(optionId);
      if (ranges.length === 0) return 1;
      return ranges[0].min || 1;
    },

    getCascadeTotalMax(optionId) {
      const ranges = this.getCascadeValidRanges(optionId);
      if (ranges.length === 0) return 999;
      return Math.max(...ranges.map(r => r.max));
    },

    isInRange(val, range) {
      return val >= range.min && val <= range.max;
    },

    isInAnyRange(val, ranges) {
      return ranges.some(r => this.isInRange(val, r));
    },

    // 修正到最近的合法值
    snapToNearestValid(val, ranges) {
      if (ranges.length === 0) return 1;
      if (this.isInAnyRange(val, ranges)) return val;
      let closest = ranges[0].min;
      let minDist = Math.abs(val - closest);
      for (const range of ranges) {
        const distMin = Math.abs(val - range.min);
        const distMax = Math.abs(val - range.max);
        if (distMin < minDist) {
          minDist = distMin;
          closest = range.min;
        }
        if (distMax < minDist) {
          minDist = distMax;
          closest = range.max;
        }
      }
      return closest;
    },
    // ==================== 选中操作 ====================
    handleCascadeSelect(optionId, levelIndex, item) {
      const state = this.cascadeStates[optionId];
      if (!state) return;
      const newIds = state.selectedIds.slice(0, levelIndex);
      const newItems = state.selectedItems.slice(0, levelIndex);
      newIds.push(item.item_id);
      newItems.push(item);
      // 自动递归选中后续每层第一项直到叶子
      let current = item;
      while (current.is_leaf === 0 && current.children && current.children.length > 0) {
        const firstChild = current.children[0];
        newIds.push(firstChild.item_id);
        newItems.push(firstChild);
        current = firstChild;
      }
      // 更新状态
      this.$set(state, 'selectedIds', newIds);
      this.$set(state, 'selectedItems', newItems);
      // 重置数量
      this.$nextTick(() => {
        this.updateCascadeQuantity(optionId);
        this.onCascadeChange(optionId);
      });
    },

    // 切换后重置数量
    updateCascadeQuantity(optionId) {
      const state = this.cascadeStates[optionId];
      if (!state) return;

      const leaf = this.getCascadeLeafNode(optionId);
      if (!leaf) return;

      if (leaf.fee_type === 'fixed') {
        this.$set(state, 'quantity', 1);
      } else {
        const ranges = this.extractValidRanges(leaf);
        if (ranges.length > 0) {
          this.$set(state, 'quantity', ranges[0].min || 1);
        } else {
          this.$set(state, 'quantity', 1);
        }
      }
    },

    // 级联数量拖动
    onCascadeQuantityChange(optionId, val) {
      if (val === undefined || val === null) return;
      const ranges = this.getCascadeValidRanges(optionId);
      const state = this.cascadeStates[optionId];
      if (ranges.length > 0 && !this.isInAnyRange(val, ranges)) {
        const corrected = this.snapToNearestValid(val, ranges);
        this.$set(state, 'quantity', corrected);
      }
      this.debounceCascadeChange(optionId);
    },
    // 防抖
    debounceCascadeChange(optionId) {
      if (this.cascadeTimers[optionId]) {
        clearTimeout(this.cascadeTimers[optionId]);
      }
      this.cascadeTimers[optionId] = setTimeout(() => {
        this.onCascadeChange(optionId);
      }, 500);
    },

    onCascadeChange(optionId) {
      this.changeConfig();
    },

    // ==================== 获取最终结果 ====================
    getCascadeResult(optionId) {
      const leaf = this.getCascadeLeafNode(optionId);
      if (!leaf) return {};
      const state = this.cascadeStates[optionId];
      let qty = 1;
      if (leaf.fee_type === 'fixed') {
        qty = 1;
      } else {
        qty = state ? state.quantity : 1;
      }
      return {
        [optionId]: {
          item_id: String(leaf.item_id),
          quantity: qty
        }
      };
    },

    // 获取所有 cascade 类型的配置结果（用于配置里的 cascade_configoption ）
    getAllCascadeResults() {
      const results = {};
      this.configoptions.forEach(item => {
        if (item.option_type === 'cascade') {
          const r = this.getCascadeResult(item.id);
          Object.assign(results, r);
        }
      });
      return results;
    },
    // #endregion ============== 级联 ==============


    hadelSafeConfirm(val, remember) {
      this[val]("", remember);
    },
    // 获取实例状态
    getCloudStatus() {
      const params = {
        id: this.id,
        func: "status",
      };
      provision(params)
        .then((res) => {
          if (res.status === 200) {
            this.postPowerStatus = res.data.data.status;
            this.statusText = res.data.data.des;
            if (this.status == "operating") {
              setTimeout(() => {
                this.getCloudStatus();
              }, 2000);
            } else {
              this.$emit("getstatus", res.data.data.status);
            }
          }
        })
        .catch((err) => {
          setTimeout(() => {
            this.getCloudStatus();
          }, 2000);
        });
    },
    /* 2023/11/22新增  */
    // 跳转对应页面
    getstarttime(type) {
      // 1: 实时(近1小时) 2：本日日(24小时) 3：本周(7天)
      let nowtime = parseInt(new Date().getTime() / 1000);
      if (type == 1) {
        this.startTime = nowtime - 60 * 60;
      } else if (type == 2) {
        this.startTime = nowtime - 24 * 60 * 60;
      } else if (type == 3) {
        this.startTime = nowtime - 24 * 60 * 60 * 7;
      }
    },
    // 统计图表开始
    // 获取内存用量
    getChartList() {
      this.chartData.forEach((items, i) => {
        items.loading = true;
        const params = {
          id: this.id,
          chart: {
            start: this.startTime,
            type: items.type,
            select: items.selectValue,
          },
        };
        chartList(params)
          .then((res) => {
            if (res.data.status === 200) {
              const list = res.data.data.list;
              const options = {
                title: {
                  text: items.title,
                },
                tooltip: {
                  show: true,
                  trigger: "axis",
                },
                legend: {
                  data: res.data.data.label,
                },
                grid: {
                  left: "8%",
                  right: "8%",
                  bottom: "5%",
                  containLabel: true,
                },
                xAxis: {
                  type: "category",
                  boundaryGap: false,
                  data: list[0].map((item) => item.time),
                },
                yAxis: {
                  type: "value",
                },
                series: res.data.data.label.map((item, index) => {
                  return {
                    name: item,
                    data: list[index].map((item) => item.value),
                    type: "line",
                    areaStyle: {},
                  };
                }),
              };
              echarts
                .init(document.getElementById(`${i}-echart`))
                .setOption(options);
            }
            items.loading = false;
          })
          .catch((err) => {
            items.loading = false;
          });
      });
    },
    // 时间选择框
    chartSelectChange(e) {
      // 计算开始时间
      this.getstarttime(e);
      // 重新拉取图表数据
      this.getChartList();
    },
    // 显示电源操作确认弹窗
    showPowerDialog() {
      this.powerTitle = this.powerList.filter(
        (item) => item.func === this.powerStatus
      )[0].name;
      this.powerType = this.powerStatus;
      this.isShowPowerChange = true;
    },
    // 随机生成密码
    autoPass() {
      // 重置密码
      this.rePassData.password =
        randomCoding(1) + 0 + genEnCode(9, 1, 1, 0, 1, 0);
    },
    handelConsole(item) {
      this.consoleData = item;
      if (item.func === "crack_pass") {
        this.showRePass();
      }
      if (item.func === "reinstall") {
        // 跳转到重装系统标签页
        this.activeName = "reinstall";
        this.loadOsTemplates();
        return;
      }
      if (item.func === "vnc_xtermjs") {
        this.doGetVncUrl("xtermjs");
      }
      if (item.func === "vnc_novnc") {
        this.doGetVncUrl("novnc");
      }
    },
    // 展示重装系统弹窗
    showReinstall() {
      this.errText = "";
      this.isShowReinstallDialog = true;
    },
    // 关闭重装系统弹窗
    reinstallDgClose() {
      this.isShowReinstallDialog = false;
    },
    // 升降级镜像切换
    osSelectGroupChangeUpgrade(e, item) {
      const obj = item.subs.filter((sub) => sub.os === this.osGroupId)[0];
      this.osSelectData = obj.version;
      this.osIcon =
        "/plugins/server/rainyunrcs/template/clientarea/img/rainyunrcs/" +
        obj.os.toLowerCase() +
        ".svg";
      this.configForm[item.id] = obj.version[0].id;
      this.changeConfig();
    },
    // 镜像分组改变时
    osSelectGroupChange(e) {
      this.osData.subs.forEach((item) => {
        if (item.os == e) {
          this.osSelectData = item.version;
          this.selectOsObj = this.osSelectData[0];
          if (item.os) {
            this.osIcon =
              "/plugins/server/rainyunrcs/template/clientarea/img/rainyunrcs/" +
              item.os.toLowerCase() +
              ".svg";
          }
          this.reinstallData.osId = item.version[0].id;
        }
      });
    },
    // 随机生成port
    autoPort() {
      this.reinstallData.port = genEnCode(3, 1, 0, 0, 0, 0);
    },
    // 镜像版本改变时
    osSelectChange() {
      this.selectOsObj = this.osSelectData.filter(
        (item) => item.id === this.reinstallData.osId
      )[0];
    },
    // 提交重装系统
    doReinstall(e, remember_operate_password = 0) {
      let isPass = true;
      const data = { ...this.reinstallData };
      if (!data.osId) {
        isPass = false;
        this.errText = lang.common_cloud_text45;
        return false;
      }
      // if (!this.client_operate_password) {
      //   this.$refs.safeRef.openDialog("doReinstall");
      //   return;
      // }
      const client_operate_password = this.client_operate_password;
      this.client_operate_password = "";
      if (isPass) {
        this.errText = "";
        provision({
          id: this.id,
          func: "reinstall",
          option_id: this.osData.id,
          sub_id: this.selectOsObj.id,
          os: this.selectOsObj.option_param,
          os_name: this.selectOsObj.option_name,
          client_operate_password,
          client_operate_methods: "doReinstall",
          remember_operate_password,
        })
          .then((res) => {
            this.$message.success(res.data.msg);
            this.getDetail();
            this.isShowReinstallDialog = false;
          })
          .catch((err) => {
            if (err.data.data) {
              if (
                !client_operate_password &&
                err.data.data.operate_password === 1
              ) {
                return;
              } else {
                return this.$message.error(err.data.msg);
              }
            }
            this.errText = err.data.msg;
          });
      }
    },
    copyPass(text) {
      if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        this.$message.success(lang.index_text32);
        return navigator.clipboard.writeText(text);
      } else {
        // 创建text area
        const textArea = document.createElement("textarea");
        textArea.value = text;
        // 使text area不在viewport，同时设置不可见
        document.body.appendChild(textArea);
        // textArea.focus()
        textArea.select();
        this.$message.success(lang.index_text32);
        return new Promise((res, rej) => {
          // 执行复制命令并移除文本框
          document.execCommand("copy") ? res() : rej();
          textArea.remove();
        });
      }
    },
    // 重置密码点击
    showRePass() {
      this.errText = "";
      this.rePassData = {
        password: "",
      };
      this.isShowRePass = true;
    },
    // 关闭重置密码弹窗
    rePassDgClose() {
      this.isShowRePass = false;
    },
    // 重置密码提交
    rePassSub(e, remember_operate_password = 0) {
      const data = this.rePassData;
      let isPass = true;
      // if (!this.client_operate_password) {
      //   this.$refs.safeRef.openDialog("rePassSub");
      //   return;
      // }
      const client_operate_password = this.client_operate_password;
      this.client_operate_password = "";
      if (isPass) {
        this.loading5 = true;
        this.errText = "";
        const params = {
          id: this.id,
          func: "crack_pass",
          password: data.password,
          client_operate_password,
          client_operate_methods: "rePassSub",
          remember_operate_password,
        };
        provision(params)
          .then((res) => {
            if (res.data.status === 200) {
              this.$message.success(lang.common_cloud_text63);
              this.isShowRePass = false;
              this.getDetail();
            }
            this.loading5 = false;
          })
          .catch((err) => {
            this.loading5 = false;
            if (err.data.data) {
              if (
                !client_operate_password &&
                err.data.data.operate_password === 1
              ) {
                return;
              } else {
                return this.$message.error(err.data.msg);
              }
            }
            this.errText = err.data.msg;
          });
      }
    },
    // 控制台点击 - 支持两种VNC模式
    doGetVncUrl(consoleType = "xtermjs", remember_operate_password = 0) {
      // if (!this.client_operate_password) {
      //   this.$refs.safeRef.openDialog("doGetVncUrl");
      //   return;
      // }
      const client_operate_password = this.client_operate_password;
      this.client_operate_password = "";

      const params = {
        id: this.id,
        func: "vnc",
        console_type: consoleType,
        client_operate_password,
        client_operate_methods: "doGetVncUrl",
        remember_operate_password,
      };
      provision(params)
        .then((res) => {
          if (res.data.status === 200) {
            const data = res.data.data;
            // 优先使用 VNCProxyURL 直连打开
            if (data.VNCProxyURL && data.VNCProxyURL.trim() !== "") {
              window.open(data.VNCProxyURL, "mcs vnc", "titlebar=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
            }
            // 否则走 RequestURL 流程（POST 鉴权后跳转）
            else if (data.RequestURL && data.RequestURL.trim() !== "") {
              window.axios({
                url: data.RequestURL,
                method: "POST",
                data: { pveauth: data.PVEAuth, redurl: data.RedirectURL },
                withCredentials: true,
              }).then(function () {
                window.open(data.RedirectURL, "mcs vnc", "titlebar=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
              });
            } else {
              this.$message.error("获取VNC地址失败：返回数据异常");
            }
          }
          this.loading2 = false;
        })
        .catch((err) => {
          this.loading2 = false;
          if (err.data && err.data.data) {
            if (
              !client_operate_password &&
              err.data.data.operate_password === 1
            ) {
              return;
            } else {
              return this.$message.error(err.data.msg);
            }
          }
          this.$message.error(err.data.msg);
        });
    },
    // 电源相关
    toChangePower(e, remember_operate_password = 0) {
      if (this.loading1) {
        return;
      }
      // if (!this.client_operate_password) {
      //   this.$refs.safeRef.openDialog("toChangePower");
      //   return;
      // }
      const client_operate_password = this.client_operate_password;
      this.client_operate_password = "";
      this.loading1 = true;
      provision({
        id: this.id,
        func: this.powerStatus,
        client_operate_password,
        client_operate_methods: "toChangePower",
        remember_operate_password,
      })
        .then((res) => {
          this.$message.success(res.data.msg);
          this.loading1 = false;
          this.isShowPowerChange = false;
          this.getDetail();
        })
        .catch((err) => {
          this.loading1 = false;
          if (err.data.data) {
            if (
              !client_operate_password &&
              err.data.data.operate_password === 1
            ) {
              return;
            } else {
              return this.$message.error(err.data.msg);
            }
          }
          this.$message.error(err.data.msg);
        });
    },
    powerDgClose() {
      this.isShowPowerChange = false;
    },
    async handleClick() {
      // 重装系统标签页不需要刷新，直接加载OS列表
      if (this.activeName === 'reinstall') {
        this.loadOsTemplates();
        return;
      }
      this.getDetail();
      switch (this.activeName) {
        case "0":
          break;
        case "1":
          this.chartSelectValue = "1";
          this.getstarttime(1);
          this.getChartList();
          break;
        case "2":
          break;
        default:
          const key = this.client_area[this.activeName * 1 - 3].key;
          if (key === 'nat') {
            this.getNatList();
          } else {
            configArea({ id: this.id, key }).then((res) => {
              this.$nextTick(() => {
                $(`#arae-${this.activeName}`).html(res.data.data.html);
              });
            });
          }
          break;
      }
    },
    /* 升降级 */
    handelUpLicense(val) {
      if (this.upgradeLoading) return;
      if (val !== "isUpApp") {
        this.buy_id = "";
        this.buy_host_id = "";
      }
      this.upgradeLoading = true;
      this.licenseActive = "1";
      this.selectUpIndex = 0;
      this.$message({
        showClose: true,
        message: lang.common_cloud_text54,
        type: "warning",
        duration: 10000,
      });
      this.handleTabClick({ name: "1" });
      this.curCycle = 0;
    },



    handleTabClick(e) {
      this.selectUpIndex = 0;
      const upApi = this.buy_id ? upAppPage : upgradePage;
      const configApi = this.buy_id ? upgradeAppPage : upgradeConfigPage;
      const id = this.buy_id ? this.buy_host_id : this.id;
      if (e.name === "1") {
        // 产品升降级
        this.isShowUp = true;
        upApi(id)
          .then((res) => {
            this.upgradeList = res.data.data.upgrade;
            if (res.data.data.upgrade.length === 0) {
              this.isShowUp = false;
              this.licenseActive = "2";
              this.handleTabClick({ name: "2" });
              return;
            }
            this.upgradeHost = res.data.data.host;
            this.upgradeConfig = res.data.data.configoptions;
            this.upgradeSon_host = res.data.data.son_host;
            this.upgradeLoading = false;
            this.getConfig();
            this.upLicenseDialogShow = true;
          })
          .catch((err) => {
            this.$message.warning(err.data && err.data.msg);
            this.upgradeLoading = false;
          });
      } else {
        // 配置升降级
        configApi(id)
          .then((res) => {
            this.upgradeList = res.data.data.upgrade_configoptions;
            this.upgradeHost = res.data.data.host;
            this.upgradeConfig = res.data.data.configoptions;
            this.upgradeSon_host = res.data.data.son_host;
            this.upgradeLoading = false;
            this.getConfig();
            this.upLicenseDialogShow = true;
          })
          .catch((err) => {
            this.$message.warning(err.data && err.data.msg);
            this.upgradeLoading = false;
          });
      }
    },

    // 切换国家
    changeCountry(id, index) {
      this.$set(this.curCountry, id, index);
      this.configForm[id] = this.filterCountry[id][index][0]?.id;
      this.changeConfig();
    },
    // 切换城市
    changeCity(el, id) {
      this.configForm[id] = el.id;
      this.changeConfig();
    },
    // 切换单击选择
    changeClick(id, el) {
      this.configForm[id] = el.id;
      this.changeConfig();
    },
    // 父商品数据输入
    fatherChange(val, i) {
      if (
        i.subs &&
        i.subs[0] &&
        i.option_type === "quantity_range" &&
        !i.rangeOption.includes(val)
      ) {
        const res = i.rangeOption.reduce((prev, curr) =>
          Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
        );
        this.configForm[i.id] = [res * 1];
      }
      const fatherArr = this.configoptions.filter((item) => {
        if (
          item.option_type === "quantity_range" ||
          item.option_type === "quantity"
        ) {
          return item;
        }
      });
      let num = 0;
      const fatherId = fatherArr.map((item) => {
        return item.id;
      });
      fatherId.forEach((item) => {
        num = this.configForm[item][0]
          ? this.configForm[item][0] * 1 + num
          : this.configForm[item] * 1 + num;
      });
      let arr = [];
      this.upSon.forEach((item) => {
        arr = item.configoptions.filter((items) => {
          if (
            item.basicInfo.configoption_id > 0 &&
            (items.option_type === "quantity_range" ||
              items.option_type === "quantity")
          ) {
            return item;
          }
        });
      });
      const arr1 = arr.map((item) => {
        return item.id;
      });
      arr1.forEach((item) => {
        this.sonConfigForm[0][item] = [num];
      });
      this.changeConfig();
    },
    // 切换配置选项
    changeItem() {
      this.changeConfig();
    },
    createArr([m, n], step) {
      // 每个阶段最小值开始计算，最小值可取
      let temp = [m];
      let cur = m;
      while (cur < n && cur + step <= n) {
        cur += step;
        temp.push(cur);
      }
      return temp;
    },
    async getConfig() {
      this.upSon = [];
      this.buySonData = [];
      this.sonCurCycle = [];
      this.sonCountry = [];
      this.sonConfigForm = [];
      this.sonCycle = [];
      this.sonCurCountry = [];
      try {
        const tabVal = this.licenseActive;
        if (tabVal === "1") {
          const temp = this.upgradeList[this.selectUpIndex * 1];
          this.basicInfo = temp.common_product;
          this.configoptions = temp.configoptions
            .filter((item) => item.subs.length)
            .map((item) => {
              if (item.option_type === "quantity_range") {
                item.rangeOption = [];
                item.subs = item.subs.sort((a, b) => a.qty_min - b.qty_min);
                item.subs.forEach((sub) => {
                  item.rangeOption.push(
                    ...this.createArr(
                      [sub.qty_min, sub.qty_max],
                      item.qty_change
                    )
                  );
                });
              }
              return item;
            });
          this.initAllCascade();
          this.custom_cycles = temp.custom_cycles;
          this.pay_type = temp.common_product?.pay_type;
          this.onetime =
            temp.cycles?.onetime === "-1.00" ? "0.00" : temp.cycles.onetime;
          // 初始化自定义配置参数
          const obj = this.configoptions.reduce((all, cur) => {
            all[cur.id] =
              cur.option_type === "multi_select" ||
                cur.option_type === "quantity" ||
                cur.option_type === "quantity_range"
                ? [
                  cur.option_type === "multi_select"
                    ? cur.subs[0].id
                    : cur.subs[0].qty_min,
                ]
                : cur.subs[0].id;
            // 区域的时候保存国家
            if (cur.option_type === "area") {
              this.filterCountry[cur.id] = this.toTree(cur.subs);
              this.$set(this.curCountry, cur.id, 0);
            }
            if (cur.option_type === "os") {
              this.osGroupId = cur.subs[0].os;
              this.osSelectData = cur.subs[0].version;
              all[cur.id] = cur.subs[0].version[0].id;
              this.osIcon =
                "/plugins/server/rainyunrcs/template/clientarea/img/rainyunrcs/" +
                cur.subs[0].os.toLowerCase() +
                ".svg";
            }
            return all;
          }, {});
          this.configForm = obj;
          // 处理费用周期
          if (this.pay_type === "onetime") {
            this.cycle = "onetime";
          } else if (this.pay_type === "free") {
            this.cycle = "free";
          } else {
            this.cycle = temp.custom_cycles[0].id;
          }
        } else {
          const temp = JSON.parse(JSON.stringify(this.upgradeList));
          this.configoptions = temp.map((item) => {
            if (item.option_type === "quantity_range") {
              item.rangeOption = [];
              item.subs = item.subs.sort((a, b) => a.qty_min - b.qty_min);
              item.subs.forEach((sub) => {
                item.rangeOption.push(
                  ...this.createArr([sub.qty_min, sub.qty_max], item.qty_change)
                );
              });
            }
            return item;
          });
          this.initAllCascade();
          // 初始化自定义配置参数
          const obj = this.configoptions.reduce((all, cur) => {
            if (cur.option_type === "multi_select") {
              const mulArr = this.upgradeConfig.reduce((sum, c) => {
                if (c.id === cur.id) {
                  sum.push(c.configoption_sub_id);
                }
                return sum;
              }, []);
              all[cur.id] = mulArr;
            } else if (cur.option_type === "quantity") {
              all[cur.id] = this.backfillId("quantity", cur.id);
            } else if (cur.option_type === "cascade") {
              all[cur.id] = {
                item_id: this.backfillId("cascade_item_id", cur.id),
                quantity: this.backfillId("quantity", cur.id),
              }
            } else {
              all[cur.id] =
                cur.option_type === "quantity_range"
                  ? this.backfillId("quantity_range", cur.id)
                  : this.backfillId("id", cur.id);
            }
            // 区域的时候保存国家
            if (cur.option_type === "area") {
              this.filterCountry[cur.id] = this.toTree(cur.subs);
              const curItem = this.upgradeConfig.filter(
                (item) => item.id === cur.id
              );
              let index = this.filterCountry[cur.id].findIndex((item) =>
                item
                  .reduce((sumC, cc) => {
                    sumC.push(cc.id);
                    return sumC;
                  }, [])
                  .includes(curItem[0]?.configoption_sub_id * 1)
              );
              this.$set(this.curCountry, cur.id, index);
            }
            return all;
          }, {});
          this.backups = JSON.parse(JSON.stringify({
            configoption: obj,
            cascade_configoption: this.getAllCascadeResults()
          }));
          this.configForm = obj;
          this.restoreCascadeSelections(obj)
        }
        this.changeConfig();
      } catch (error) {
        console.log("error", error);
      }
    },
    // 回填处理id
    backfillId(type, id) {
      const temp = this.upgradeConfig.filter((item) => item.id === id);
      if (type === "id") {
        return temp[0]?.configoption_sub_id;
      } else if (type === "quantity_range") {
        return [temp[0]?.qty];
      } else if (type === "cascade_item_id") {
        return temp[0]?.cascade_item_id;
      } else {
        return temp[0]?.qty;
      }
    },
    // 数组转树
    toTree(data) {
      const temp = Object.values(
        data.reduce((res, item) => {
          if (res[item.country]) {
            res[item.country].push(item)
          } else {
            res[item.country] = [item]
          }
          return res;
        }, {})
      );
      return temp;
    },
    goPay() {
      if (this.hostData.status === "Unpaid") {
        this.$refs.payDialog.showPayDialog(this.hostData.order_id);
      }
    },
    // 切换周期
    changeCycle(item, index) {
      this.cycle = item.id;
      this.curCycle = index;

      if (
        this.basicInfo.pay_type === "recurring_prepayment" ||
        this.basicInfo.pay_type === "recurring_postpaid"
      ) {
        this.upSon.forEach((el) => {
          this.sonCycle = [];
          this.sonCurCycle = [];
          this.sonCycle.push(el.custom_cycles[index].id);
          this.sonCurCycle.push(index);
        });
      }
      this.changeConfig();
    },
    // 更改配置计算价格
    async changeConfig() {
      const tabVal = this.licenseActive;
      this.upPriceLoading = true;
      this.isExclude = 0;
      try {
        let res = {};
        const temp = this.formatData();
        const sonParams = [];
        if (tabVal === "1") {
          // 配置子商品的参数
          this.upSon.forEach((item, index) => {
            sonParams.push({
              config_options: {
                configoption: this.upFormatSubData(
                  this.sonConfigForm[index],
                  index
                ),
                cycle: this.sonCycle[index],
              },
              id: this.originSon[index].configoptions[0].product_id,
              qty: 1,
              buy: item.open,
            });
          });
          const params = {
            configoption: temp,
            cascade_configoption: this.getAllCascadeResults(),
            cycle: this.cycle,
            son: sonParams,
            product_id:
              this.upgradeList[this.selectUpIndex * 1]?.configoptions[0]
                .product_id,
          };
          res = this.buy_id
            ? await upAppPrice(this.buy_host_id, params)
            : await upgradePrice(this.id, params);
          this.upData.price = res.data.data.upgrade_price; // 原单价
          this.pro_base_price = res.data.data.base_price; // 原单价  用于优惠码和用户等级
          // 重新计算周期显示
          const calculateParams = {
            config_options: {
              configoption: { ...temp },
              cascade_configoption: this.getAllCascadeResults(),
              son: sonParams,
              cycle: this.cycle,
              host_id: this.buy_id ? this.buy_host_id : this.id,
            },
            qty: 1,
            id: this.upgradeList[this.selectUpIndex * 1]?.configoptions[0]
              .product_id,
          };
          const result = this.buy_id
            ? await buyCalculate(calculateParams)
            : await calculate(calculateParams);
          this.custom_cycles = result.data.data.custom_cycles;
          this.onetime = result.data.data.cycles.onetime;
          // 重新计算周期价格显示
          result.data.data.son ||
            [].forEach((el, ind) => {
              this.$set(this.upSon[ind], "custom_cycles", el.custom_cycles);
              this.$set(this.upSon[ind], "onetime", el.cycles.onetime);
            });
        } else {
          const temp1 = this.formatData();
          const params = {
            configoption: temp1,
            cascade_configoption: this.getAllCascadeResults(),
            buy: this.isBuyServe
          };
          res = this.buy_id
            ? await syncAppPrice(this.buy_host_id, params)
            : await syncUpgradePrice(this.id, params);
          this.upData.price = res.data.data.price; // 原单价
          this.pro_base_price = res.data.data.price; // 原单价  用于优惠码和用户等级     // 原单价
        }
        if (this.isShowLevel) {
          // 计算折扣金额
          const discount = await clientLevelAmount({
            id:
              tabVal === "1"
                ? this.upgradeList[this.selectUpIndex * 1]?.configoptions[0]
                  .product_id
                : this.product_id,
            amount: this.pro_base_price,
          });
          this.upData.clDiscount = Number(discount.data.data.discount);
        }
        // 开启了优惠码插件
        if (this.isShowPromo) {
          // 更新优惠码
          await applyPromoCode({
            // 开启了优惠券
            scene: "upgrade",
            product_id:
              tabVal === "1"
                ? this.upgradeList[this.selectUpIndex * 1]?.configoptions[0]
                  .product_id
                : this.product_id,
            amount: this.pro_base_price * 1,
            billing_cycle_time: this.host.billing_cycle_time,
            promo_code: "",
            host_id: this.id,
          })
            .then((resss) => {
              this.upData.code_discount = Number(resss.data.data.discount);
              this.isExclude = resss.data.data.exclude_with_client_level;
            })
            .catch((err) => {
              this.upData.code_discount = 0;
            });
        }
        // 处理互斥
        if (this.isExclude === 1) {
          this.upData.clDiscount = 0;
        }
        this.upData.totalPrice =
          (this.upData.price * 1000 -
            this.upData.clDiscount * 1000 -
            this.upData.code_discount * 1000) /
          1000;

        this.upPriceLoading = false;
      } catch (error) {
        this.upPriceLoading = false;
        this.dataLoading = false;
      }
    },
    formatData() {
      // 处理数量类型的转为数组
      const temp = JSON.parse(JSON.stringify(this.configForm));
      Object.keys(temp).forEach((el) => {
        const arr = this.configoptions.filter((item) => item.id * 1 === el * 1);
        if (arr.length !== 0) {
          if (
            arr[0].option_type === "quantity" ||
            arr[0].option_type === "quantity_range" ||
            arr[0].option_type === "multi_select"
          ) {
            if (typeof temp[el] !== "object") {
              temp[el] = [temp[el]];
            }
          }
        }
      });
      return temp;
    },
    // 点击可升级授权
    selectUpItem(index) {
      this.selectUpIndex = index;
      this.curCycle = 0;
      this.getConfig();
    },
    // 提交升级
    handelUpConfirm() {
      if (this.upBtnLoading) return;
      // this.upBtnLoading = true
      if (this.licenseActive === "1") {
        const temp = this.formatData();
        // 配置子商品的参数
        const sonParams = [];
        this.upSon.forEach((item, index) => {
          sonParams.push({
            config_options: {
              configoption: this.upFormatSubData(
                this.sonConfigForm[index],
                index
              ),
              cycle: this.sonCycle[index],
            },
            id: this.originSon[index].configoptions[0].product_id,
            qty: 1,
            buy: item.open,
          });
        });
        // 配置子商品的参数
        const params = {
          id: this.id,
          product_id:
            this.upgradeList[this.selectUpIndex * 1]?.configoptions[0]
              .product_id,
          config_options: {
            configoption: temp,
            cascade_configoption: this.getAllCascadeResults(),
            cycle: this.cycle,
            son: sonParams,
          },
          qty: 1,
          customfield: {},
        };
        const upHostApi = this.buy_id ? upAppHost : upgradeHost;
        const id = this.buy_id ? this.buy_host_id : this.id;
        upHostApi(id, params)
          .then((res) => {
            this.$refs.payDialog.showPayDialog(res.data.data.id);
          })
          .catch((err) => {
            this.$message.error(err.data.msg);
          })
          .finally(() => {
            this.upBtnLoading = false;
            this.upLicenseDialogShow = false;
          });
      } else {

        const bol = this.isEquivalent(this.backups, {
          configoption: this.configForm,
          cascade_configoption: this.getAllCascadeResults()
        });
        if (bol) {
          this.$message.error(lang.common_cloud_text241);
          this.upBtnLoading = false;
          return;
        }
        const temp1 = this.formatData();
        const params = {
          configoption: temp1,
          buy: this.isBuyServe,
          cascade_configoption: this.getAllCascadeResults(),
        };
        const upConfigApi = this.buy_id ? upgradeAppHost : upgradeConfigHost;
        const id = this.buy_id ? this.buy_host_id : this.id;
        upConfigApi(id, params)
          .then((res) => {
            this.$refs.payDialog.showPayDialog(res.data.data.id);
          })
          .catch((err) => {
            this.$message.error(err.data.msg);
          })
          .finally(() => {
            this.upBtnLoading = false;
            this.upLicenseDialogShow = false;
          });
      }
    },
    // 比较对象是否相等
    isEquivalent(a, b) {
      // a:已有配置  b:当前配置
      // 获取a和b对象的属性名数组
      const aProps = Object.getOwnPropertyNames(a);
      // 遍历对象的每个属性并进行比较
      for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i];
        // 如果属性值为对象，则递归调用该函数进行比较
        if (typeof a[propName] === "object") {
          if (!this.isEquivalent(a[propName], b[propName])) {
            return false;
          }
        } else {
          if (b.hasOwnProperty(propName)) {
            // 否则，直接比较属性值
            if (a[propName] !== b[propName]) {
              return false;
            }
          }
        }
      }
      // 如果遍历完成则说明两个对象内容相同
      return true;
    },
    /* 升降级 end */
    changeAutoStatus(e) {
      this.dialogVisible = true;
      this.autoTitle = this.isShowPayMsg
        ? lang.common_cloud_text242
        : lang.common_cloud_text243;
    },
    async changeAuto() {
      try {
        const params = {
          id: this.id,
          status: this.isShowPayMsg,
        };
        const res = await rennewAuto(params);
        this.$message.success(res.data.msg);
        this.dialogVisible = false;
        this.getRenewStatus();
      } catch (error) {
        this.$message.error(error.data.msg);
      }
    },
    async getRenewStatus() {
      try {
        const res = await renewStatus({
          id: this.id,
        });
        this.isShowPayMsg = res.data.data.status;
      } catch (error) { }
    },
    async getPromo() {
      try {
        const res = await getPromoCode(this.id);
        this.promo_code = res.data.data.promo_code;
      } catch (error) { }
    },
    /* 备注 */
    async getComDetail() {
      try {
        const res = await getCommonDetail(this.id);
        this.hostData = res.data.data.host;
        this.self_defined_field = res.data.data.self_defined_field.map(
          (item) => {
            item.hidenPass = false;
            return item;
          }
        );
        this.product_id = res.data.data.host.product_id;
      } catch (error) { }
    },
    // 显示 修改备注 弹窗
    doEditNotes() {
      this.isShowNotesDialog = true;
      this.notesValue = this.hostData.notes;
    },
    // 修改备注提交
    async subNotes() {
      const params = {
        id: this.id,
        notes: this.notesValue,
      };
      try {
        const res = await changeNotes(params);
        this.$message.success(res.data.msg);
        this.isShowNotesDialog = false;
        this.getComDetail();
      } catch (error) {
        this.$message.error(error.data.msg);
      }
    },
    notesDgClose() {
      this.isShowNotesDialog = false;
    },
    // 获取退款信息
    async getRefundInfo() {
      try {
        const res = await getRefundInfo(this.id);
        this.refundInfo = res.data.data.refund;
      } catch (error) { }
    },
    /* 停用 */
    async stop_use() {
      this.refundForm.str = "";
      this.refundForm.arr = [];

      this.refundMoney = "0.00";
      try {
        const res = await getRefund(this.id);
        this.refundDialog = res.data.data;
        // if (!this.refundDialog.allow_refund) {
        //   this.noRefundVisible = true
        //   return false
        // }
        this.refundVisible = true;
      } catch (error) {
        this.$message.error(error.data.msg);
      }
    },
    changeReson(e) {
      this.refundMoney =
        e === "Immediate" ? this.refundDialog.host.amount : "0.00";
    },
    async submitRefund(e, remember_operate_password = 0) {
      const client_operate_password = this.client_operate_password;
      this.client_operate_password = "";
      try {
        if (this.refundDialog.reason_custom) {
          // 自定义
          if (!this.refundForm.str) {
            return this.$message.error(lang.common_cloud_label44);
          }
        } else {
          if (this.refundForm.arr.length === 0) {
            return this.$message.error(lang.common_cloud_text58);
          }
        }
        // if (!this.client_operate_password) {
        //   this.$refs.safeRef.openDialog("submitRefund");
        //   return;
        // }
        const params = {
          host_id: this.id,
          type: this.refundForm.type,
          suspend_reason: this.refundDialog.reason_custom
            ? this.refundForm.str
            : this.refundForm.arr,
          client_operate_password,
          client_operate_methods: "submitRefund",
          remember_operate_password,
        };
        this.loading = true;
        const res = await submitRefund(params);
        this.loading = false;
        this.$message.success(lang.common_cloud_text60);
        this.refundVisible = false;
        this.getRefundInfo();
      } catch (err) {
        this.loading = false;
        if (err.data.data) {
          if (
            !client_operate_password &&
            err.data.data.operate_password === 1
          ) {
            return;
          } else {
            return this.$message.error(err.data.msg);
          }
        }
        this.$message.error(err.data.msg);
      }
    },

    // 取消停用
    async cancelRefund(e, remember_operate_password = 0) {
      // if (!this.client_operate_password) {
      //   this.$refs.safeRef.openDialog("cancelRefund");
      //   return;
      // }
      const client_operate_password = this.client_operate_password;
      this.client_operate_password = "";

      try {
        const res = await cancelRefund({
          id: this.refundInfo.id,
          client_operate_password,
          client_operate_methods: "cancelRefund",
          remember_operate_password,
        });
        this.$message.success(lang.common_cloud_text220);
        this.getRefundInfo();
      } catch (err) {
        if (err.data.data) {
          if (
            !client_operate_password &&
            err.data.data.operate_password === 1
          ) {
            return;
          } else {
            return this.$message.error(err.data.msg);
          }
        }
        this.$message.error(err.data.msg);
      }
    },

    async getCountryList() {
      try {
        const res = await getCountry();
        this.countryList = res.data.data.list;
      } catch (error) { }
    },
    async getDetail() {
      try {
        const res = await getCommonListDetail(this.id);
        this.host = res.data.data.host;
        const temp = res.data.data.configoptions.map((item) => {
          item.show = false;
          return item;
        });
        this.firstInfo = temp;
        this.chartData = res.data.data.chart.map((item) => {
          item.selectValue = item.select[0]?.value || "";
          item.loading = false;
          return item;
        });
        this.client_area = res.data.data.client_area.filter(item => item.key !== 'disk' && item.key !== 'backup');
        this.client_button = res.data.data.client_button;
        this.powerList = res.data.data.client_button?.control || [];
        this.powerStatus = this.powerList[0]?.func || "";
        this.consoleList = res.data.data.client_button?.console || [];
        // OS列表由重装系统标签页独立加载，不清空以免闪烁
        this.osData = {};

        this.initLoading = false;
      } catch (error) {
        console.log(error);
      }
    },
    // === 重装系统标签页 ===
    // 加载OS模板列表（直接从API获取，按region和machine过滤）
    async loadOsTemplates() {
      // 避免重复加载
      if (this._loadingOs) return;
      this._loadingOs = true;
      try {
        // 先确保 host 数据已加载（获取region/machine）
        if (!this.host?.region) {
          await this.getDetail();
        }
        const productId = this.product_id || this.host?.product_id;
        if (!productId) return;
        const res = await getOsTemplates(productId);
        const osData = res.data?.data;
        if (osData) {
          const region = this.host?.region || '';
          const planMachine = this.host?.machine || '';
          this.osList = osData.filter(os => {
            // region必须匹配
            if (os.region !== region) return false;
            // 不可用的排除
            if (os.is_available !== true) return false;
            // 排除gpu和btpanel
            if (os.name.toLowerCase().includes('gpu')) return false;
            if (os.name.toLowerCase().includes('btpanel')) return false;
            // machine过滤：为空表示所有机器兼容；否则逗号分隔，plan的machine需在列表中
            if (os.machine) {
              const machines = os.machine.split(',').map(m => m.trim());
              if (!machines.includes(planMachine)) return false;
            }
            return true;
          });
        }
      } catch (e) {
        console.error('加载OS模板失败', e);
      } finally {
        this._loadingOs = false;
      }
      // 展开第一个分组
      this.$nextTick(() => {
        if (this.reinstallOsGroups.length > 0 && !this.reinstallExpandedGroup) {
          this.reinstallExpandedGroup = this.reinstallOsGroups[0].icon;
        }
      });
    },
    getOsLogo(icon) {
      const info = osInfoMap[icon];
      if (info && info.logo) return info.logo;
      // fallback: 使用本地SVG图标
      const fallbackMap = {
        debian: 'Debian', ubuntu: 'Ubuntu', centos: 'CentOS',
        windows: 'Windows', rocky_linux: 'RockyLinux',
        alpine_linux: 'AlpineLinux', mac_o_s: 'MacOS'
      };
      return '/plugins/server/rainyunrcs/template/clientarea/img/rainyunrcs/' + (fallbackMap[icon] || icon) + '.svg';
    },
    reinstallToggleGroup(icon) {
      this.reinstallExpandedGroup = this.reinstallExpandedGroup === icon ? '' : icon;
    },
    reinstallSelectOs(os) {
      this.reinstallSelectedOsId = os.id;
      this.reinstallExpandedGroup = '';
      this.reinstallErrText = '';
    },
    reinstallGetSelectedVersionName(group) {
      if (this.reinstallSelectedOsId === null) return '请选择版本';
      const found = group.items.find(os => os.id === this.reinstallSelectedOsId);
      return found ? (found.chinese_name || found.name) : '请选择版本';
    },
    doReinstallFromTab() {
      if (!this.reinstallSelectedOsId) {
        this.reinstallErrText = '请先选择要安装的操作系统';
        return;
      }
      if (!this.reinstallConfirm) {
        this.reinstallErrText = '请先确认放弃服务器系统盘数据';
        return;
      }
      this.reinstallErrText = '';
      this.reinstallLoading = true;
      const selected = this.osList.find(os => os.id === this.reinstallSelectedOsId);
      if (!selected) {
        this.reinstallErrText = '系统数据错误';
        this.reinstallLoading = false;
        return;
      }
      const params = {
        id: this.id,
        func: 'changeos',
        os_id: selected.id,
        reset_osd: this.reinstallResetOsd,
        os_name: selected.name || '',
      };
      provision(params)
        .then((res) => {
          this.$message.success(res.data.msg || '重装系统任务已提交');
          this.reinstallLoading = false;
          this.reinstallSelectedOsId = null;
          this.reinstallConfirm = false;
          this.reinstallResetOsd = false;
          this.getDetail();
        })
        .catch((err) => {
          this.reinstallLoading = false;
          this.reinstallErrText = err.data?.msg || '重装失败';
        });
    },
    copyText(text) {
      if (!text) return;
      if (navigator.clipboard && window.isSecureContext) {
        this.$message.success(lang.index_text32);
        return navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        this.$message.success(lang.index_text32);
        return new Promise((res, rej) => {
          document.execCommand("copy") ? res() : rej();
          textArea.remove();
        });
      }
    },
    textRange(el) {
      const targetw = el.getBoundingClientRect().width;
      const range = document.createRange();
      range.setStart(el, 0);
      range.setEnd(el, el.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      return rangeWidth > targetw;
    },
    checkWidth(e, index) {
      const bol = this.textRange(e.target);
      this.firstInfo[index].show = bol;
    },
    hideTip(index) {
      this.firstInfo[index].show = false;
    },
    back() {
      window.history.back();
    },
    /* == NAT转发管理 == */
    // 获取NAT列表
    getNatList() {
      this.natLoading = true;
      Axios.get('rainyunrcs/host/' + this.id + '/nat')
        .then((res) => {
          if (res.data.status === 200) {
            this.natList = res.data.data.list || [];
            this.natPublicIp = res.data.data.ip || '';
          }
          this.natLoading = false;
        })
        .catch(() => {
          this.natLoading = false;
        });
    },
    // 协议标签样式
    natProtocolType(type) {
      if (type === 'tcp') return 'primary';
      if (type === 'udp') return 'danger';
      return 'warning';
    },
    // 协议标签文字
    natProtocolLabel(type) {
      if (type === 'tcp_udp') return 'TCP+UDP';
      return type ? type.toUpperCase() : '';
    },
    // 提交创建NAT
    submitAddNat() {
      if (!this.natManageForm.port_out || !this.natManageForm.port_in) {
        this.$message.error('请填写完整端口信息');
        return;
      }
      this.natSubmitting = true;
      Axios.post('rainyunrcs/host/' + this.id + '/nat', {
        port_out: this.natManageForm.port_out,
        port_in: this.natManageForm.port_in,
        port_type: this.natManageForm.port_type,
      })
        .then((res) => {
          if (res.data.status === 200) {
            this.$message.success(res.data.msg);
            this.natDialogVisible = false;
            this.getNatList();
          } else {
            this.$message.error(res.data.msg);
          }
          this.natSubmitting = false;
        })
        .catch((err) => {
          this.natSubmitting = false;
          this.$message.error(err.data && err.data.msg || '添加失败');
        });
    },
    // 删除NAT转发
    deleteNat(natId) {
      this.$confirm('确定删除此NAT转发吗？', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        Axios.delete('rainyunrcs/host/' + this.id + '/nat/' + natId)
          .then((res) => {
            if (res.data.status === 200) {
              this.$message.success(res.data.msg);
              this.getNatList();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch((err) => {
            this.$message.error(err.data && err.data.msg || '删除失败');
          });
      }).catch(() => {});
    },

    // 每页展示数改变
    sizeChange(e) {
      this.params.limit = e;
      this.params.page = 1;
      // 获取列表
    },
    // 当前页改变
    currentChange(e) {
      this.params.page = e;
    },

    // 获取通用配置
    getCommonData() {
      this.commonData = JSON.parse(localStorage.getItem("common_set_before"));
      document.title =
        this.commonData.website_name + "-" + lang.common_cloud_text221;
    },

    /* 续费相关 */
    showRenew(type = "renew") {
      this.$refs.renewDialog.showRenew(type === 'demand' ? true : false);
    },
    handleRenewSuccess() {
      this.getDetail();
    },
    handleRenewPay(orderId, amount) {
      this.renewOrderId = orderId;
      this.$refs.payDialog.showPayDialog(orderId, amount);
    },
    getRenewPrice() {
      renewPage({ id: this.id })
        .then(async (res) => {
          if (res.data.status === 200) {
            this.renewPriceList = res.data.data.host;
          }
        })
        .catch((err) => {
          this.renewPriceList = [];
        });
    },

    // 支付成功回调
    paySuccess(e) {
      this.getDetail();
      this.getComDetail();
      console.log(e);
    },
    // 取消支付回调
    payCancel(e) {
      console.log(e);
    },
  },
}).$mount(template);
window.clientOperateVue = clientOperateVue;
