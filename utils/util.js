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

// 获取歌曲列表
const getTopList = () => {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5&jsonpCallback=jp1'
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            success: function(res) {
                resolve(res)
            },
            fail: function(err) {
                wx.getSystemInfo({
                    success(res) {
                        const msg = (err && err.Message) || "操作失败！";
                        sysInfo = '操作系统版本：' + res.system + '，微信版本：' + res.version + '，小程序基础库版本：' + res.SDKVersion;
                        wx.showModal({
                            title: '提示',
                            content: sysInfo + msg,
                            showCancel: false
                        })
                    }
                })
                reject(err)
            }
        })
    })
}

// 获取歌曲音乐
const getTopMusicList = topid => {
    const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${topid}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5&jsonpCallback=jp1`
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            success: function (res) {
                resolve(res)
            }
        })
    })
}

// 生成音乐对象
function Song({ id, mid, singer, name, album, duration, image, musicId }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.musicId = musicId
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}

const createSong = musicData => {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        musicId: musicData.songid
    })
}


module.exports = {
    formatTime: formatTime,
    wxRequire: wxRequire,
    getTopList: getTopList,
    getTopMusicList: getTopMusicList,
    createSong: createSong
}