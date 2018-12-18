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
            this.setData({
                musicList: res2.data.topList
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

    }
})