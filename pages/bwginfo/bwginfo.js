// pages/bwginfo/bwginfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aboutHeight: 'auto'
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
        const aboutDom = wx.createSelectorQuery().select('#bwgProfileIn');
        const This = this;
        aboutDom.boundingClientRect(function(rect) {
            if (rect.height > 200) {
                This.setData({
                    aboutHeight: '200rpx'
                })
            }
        }).exec()
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
    // 景点介绍更多点击事件
    aboutmoreEvent() {
        const aboutHeight = this.data.aboutHeight || '';
        let h = '200rpx';
        if (aboutHeight !== 'auto') {
            h = 'auto';
        }
        this.setData({
            aboutHeight: h
        });
    }
})