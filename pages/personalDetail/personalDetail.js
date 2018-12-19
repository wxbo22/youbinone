const util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 音乐列表
        musicList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const This = this;
        util.getTopList().then(res => {
            const res1 = res.data.replace('jp1(', '')
            const res2 = JSON.parse(res1.substring(0, res1.length - 1));
            let musicList = res2.data.topList || [];
            musicList.map(elem => {
                const topId = elem.id || '';
                if (!topId) return;
                util.getTopMusicList(topId).then(res => {
                    const res1 = res.data.replace('jp1(', '');
                    const res2 = JSON.parse(res1.substring(0, res1.length - 1));
                    let songDetailList = res2 && res2.songlist || [];
                    songDetailList = songDetailList.slice(0,3);
                    const makeRes = [];
                    songDetailList.map(x => {
                        const musicData = x.data;
                        if (musicData.songid && musicData.albummid) {
                            makeRes.push(util.createSong(musicData));
                        }
                    });
                    elem.songInfoList = makeRes;
                    This.setData({
                        musicList
                    })
                })
            })
        }).catch(err => {})
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    // 播放按钮事件
    playIconEvent: function(e) {
        const id = e.currentTarget.dataset.id || '';
        const idx = e.currentTarget.dataset.idx || '';
        const musicList = this.data.musicList;
        debugger
    },
    // 获取背景播放音乐的songmidid
    getBackPlayfileName: function () {
        return new Promise((resolve, reject) => {
            wx.getBackgroundAudioPlayerState({
                success: function (res) {
                    var dataUrl = res.dataUrl;
                    let ret = dataUrl && dataUrl.split('?')[0].split('/')[3];
                    resolve({ ret, res });
                },
                fail: function (e) {
                    let ret = false;
                    reject(ret);
                }
            })
        })
    },
    // 获取播放地址
    getPlayUrl: function (songmidid) {
        const This = this;
        wx.request({
            url: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=5381&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&loginUin=0&platform=yqq&needNewCode=0&cid=205361747&uin=0&filename=C400${songmidid}.m4a&guid=3913883408&songmid=${songmidid}&callback=callback`,
            data: {
                g_tk: 5381,
                inCharset: 'utf-8',
                outCharset: 'utf-8',
                notice: 0,
                format: 'jsonp',
                hostUin: 0,
                loginUin: 0,
                platform: 'yqq',
                needNewCode: 0,
                cid: 205361747,
                uin: 0,
                filename: `C400${songmidid}.m4a`,
                guid: 3913883408,
                songmid: songmidid,
                callback: 'callback',
            },
            success: function (res) {
                const res1 = res.data.replace("callback(", "");
                const res2 = JSON.parse(res1.substring(0, res1.length - 1));
                const playUrl = `http://dl.stream.qqmusic.qq.com/${res2.data.items[0].filename}?vkey=${res2.data.items[0].vkey}&guid=3913883408&uin=0&fromtag=66`;
                This.getBackPlayfileName().then((nowPlay) => {
                    if (!(res2.data.items[0].filename === nowPlay.ret)) {
                        This.createAudio(playUrl);
                    }
                }).catch((err) => {
                    This.createAudio(playUrl);
                })
            }
        })
    },

    // 创建播放器
    createAudio: function (playUrl) {
        wx.playBackgroundAudio({
            dataUrl: playUrl,
            title: this.data.currentSong.name,
            coverImgUrl: this.data.currentSong.image
        })
    },
})