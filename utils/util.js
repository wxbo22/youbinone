const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const apiUrl = 'https://qddapi.viigoo.com';
const wxRequire = function(url, method, data, success, error) {
    wx.showLoading({
        title: '加载中',
    })
    let header = {
        'content-type': 'application/json'
    };
    wx.request({
        url: `${apiUrl}/api/${url}`,
        method: method,
        data: data,
        header: header,
        success: function(suc) {
            wx.hideLoading();
            if (suc && suc.statusCode && (suc.statusCode === 401 || suc.statusCode === 403)) {
                const app = getApp();
                app.globalData.userToken = '';
                wx.redirectTo({
                    url: '/pages/myCoupons/myCoupons',
                })
            } else if (suc && suc.data && suc.data.IsSuccess) {
                success && success(suc.data);
            } else {
                let message = suc && suc.data && suc.data.ErrorMsg || '请求失败';
                wx.showModal({
                    title: '提示',
                    content: message,
                    showCancel: false
                })
                error && error(suc);
                setTimeout(function() {
                    wx.hideLoading()
                }, 500);
            }
        },
        fail: function(err) {
            wx.hideLoading();
            let sysInfo = '';
            wx.getSystemInfo({
                success(res) {
                    sysInfo = '操作系统版本：' + res.system + '，微信版本：' + res.version + '，小程序基础库版本：' + res.SDKVersion;
                    wx.showModal({
                        title: '提示',
                        content: sysInfo + err.errMsg,
                        showCancel: false
                    })
                }
            })
            setTimeout(function() {
                wx.hideLoading()
            }, 500);
        }
    })
}


module.exports = {
    formatTime: formatTime,
    wxRequire: wxRequire
}