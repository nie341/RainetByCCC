var ChessClass = require('Chess');
var Rson = require('Rson');

cc.Class({
    extends: cc.Component,

    properties: {
        lbOpen: false,
        fwOpen: false,
        vcOpen: false,
        nfOpen: false,
        isSound: true
    },

    // use this for initialization
    onLoad: function () {
        this.gameMain = cc.find('Canvas').getComponent('HelloWorld');
        this.reviewMain = cc.find('Canvas').getComponent('ReviewMain');
        this.visitMain = cc.find('Canvas').getComponent('visitMain');
        this.terminals = cc.find('Canvas/terminals');
        this.sysPanel = cc.find('Canvas/sysPanel');
        this.lb = cc.find('Canvas/terminals/lineBoost');
        this.fw = cc.find('Canvas/terminals/fireWall');
        this.vc = cc.find('Canvas/terminals/virusChecker');
        this.nf = cc.find('Canvas/terminals/404');
        this.talkInput = cc.find('Canvas/fitLayer/buttonBar/talkBox');
        this.soundIcon1 = cc.find('Canvas/sysPanel/sound/icon1');
        this.soundIcon2 = cc.find('Canvas/sysPanel/sound/icon2');
        this.soundLabel = cc.find('Canvas/sysPanel/sound/label').getComponent(cc.Label);
    },

    onLineBoost: function(){
        this.hide(this.terminals);
        
        if(!this.gameMain.lbSwitch)
        {
            if(!this.lbOpen){
                this.gameMain.removeAllBoardEvent();

                this.sendData({'code':'30', 'name':'start LB', data:{}});
                this.lbOpen = true;
                this.vcOpen = false;
                this.fwOpen = false;
                this.nfOpen = false;
                this.lb.color = new cc.Color(128, 128, 128);
            }else{cc.log('进入lineboost回调2');
                this.lbOpen = false;
                this.gameMain.removeLBEvent();
                this.lb.color = new cc.Color(255, 255, 255);
            }
        }else{
            this.sendData({'code':'30', 'name':'close LB', data:{}});
            this.lbOpen = false;
            this.lb.color = new cc.Color(255, 255, 255);
        }
    },

    onFireWall: function(){
        this.hide(this.terminals);

        if(!this.gameMain.fwSwitch)
        {
            if(!this.fwOpen){
                this.gameMain.removeAllBoardEvent();
                
                this.sendData({'code':'40', 'name':'start FW', data:{}});
                this.fwOpen = true;
                this.lbOpen = false;
                this.vcOpen = false;
                this.nfOpen = false;
                this.fw.color = new cc.Color(128, 128, 128);
            }else{
                this.fwOpen = false;
                this.gameMain.removeFWEvent();
                this.fw.color = new cc.Color(255, 255, 255);
            }
        }else{
            this.sendData({'code':'40', 'name':'close FW', data:{}});
            this.fwOpen = false;
            this.fw.color = new cc.Color(255, 255, 255);
        }
        
    },

    onVirusChecker: function(){
        this.hide(this.terminals);

        if(!this.gameMain.vcSwitch)
        {
            if(!this.vcOpen){
                this.gameMain.removeAllBoardEvent();

                this.sendData({'code':'50', 'name':'start VC', data:{}});
                this.vcOpen = true;
                this.lbOpen = false;
                this.fwOpen = false;
                this.nfOpen = false;
                this.vc.color = new cc.Color(128, 128, 128);
            }else{
                this.vcOpen = false;
                this.gameMain.removeVCEvent();
                this.vc.color = new cc.Color(255, 255, 255);
            }
        }
    },

    onNotFound: function(){
        this.hide(this.terminals);

        if(!this.gameMain.nfSwitch)
        {
            if(!this.nfOpen){
                this.gameMain.removeAllBoardEvent();

                this.sendData({'code':'60', 'name':'start NF', data:{}});
                this.nfOpen = true;
                this.lbOpen = false;
                this.vcOpen = false;
                this.fwOpen = false;
                this.nf.color = new cc.Color(128, 128, 128);
            }else{
                this.nfOpen = false;
                this.gameMain.removeNFEvent();
                this.nf.color = new cc.Color(255, 255, 255);
            }
        }
    },

    onSysClose: function(){
        this.hide(this.sysPanel);
        this.gameMain.showPop('close');
    },

    onReviewClose: function(){
        this.hide(this.sysPanel);
        this.reviewMain.closePop();
    },

    onVisitClose: function(){
        this.hide(this.sysPanel);
        this.visitMain.closePop();
    },

    onSysSound: function(){
        if(this.isSound){
            this.isSound = false;
            this.soundIcon1.active = false;
            this.soundIcon2.active = true;
            this.soundLabel.string = '开启bgm';

            cc.audioEngine.setMusicVolume(0);
        }else{
            this.isSound = true;
            this.soundIcon2.active = false;
            this.soundIcon1.active = true;
            this.soundLabel.string = '关闭bgm';

            cc.audioEngine.setMusicVolume(1);
        }
    },

    onSendTalk: function(){
        let str = this.talkInput.getComponent(cc.EditBox).string;
        this.talkInput.getComponent(cc.EditBox).string = '';

        this.sendData({'code':'80', 'name':'sendTalk', data:{'str':str}});
    },

    // 显示需要出现的对象
    // @obj: 将出现的对象
    show: function(obj){
        if(obj.active)
            return false;
        obj.active = true;
        var act1=cc.fadeIn(0.15);
        obj.runAction(act1);
        return true;
    },

    // 隐藏对象
    // @obj: 将隐藏的对象
    hide: function(obj){
        if(!obj.active)
            return false;
        var act1=cc.fadeOut(0.15);
        var callback = new cc.CallFunc(function(){
            obj.active = false;
        },this);
        var seq = cc.sequence(act1, callback);
        obj.runAction(seq);
        return true;
    },

    // 发送消息给服务端
    sendData: function(cmd){
        if(this.gameMain)
            this.gameMain.sendData(cmd);
        else if(this.visitMain)
            this.visitMain.sendData(cmd);
        else
            cc.log('send Data error at btCallFunc');
    },
});
