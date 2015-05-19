var SwipeDetect = function (element, cbs, thresholdX, thresholdY) {
    this.thresholdX = thresholdX || 30;
    this.thresholdY = thresholdY || 10;

    this.element = element;

    // Swipe handlers
    if (cbs.onNorth) {
        this.onNorth = cbs.onNorth;
    }
    if (cbs.onEast) {
        this.onEast = cbs.onEast;
    }
    if (cbs.onSouth) {
        this.onSouth = cbs.onSouth;
    }
    if (cbs.onWest) {
        this.onWest = cbs.onWest;
    }

    var that   = this;
    var isDown = false;

    function _onDown(e) {
        if (!isDown) {
            that.onDown(e);
            isDown = true;
        }

        if (e instanceof TouchEvent) {
            e.stopPropagation();
        }
    }

    function _onUp(e) {
        if (isDown) {
            that.onUp(e);
            isDown = false;
        }

        if (e instanceof TouchEvent) {
            e.stopPropagation();
        }
    }

    this.element.addEventListener('touchstart', _onDown, false);
    this.element.addEventListener('touchend', _onUp, false);
    this.element.addEventListener('mousedown', _onDown, false);
    this.element.addEventListener('mouseup', _onUp, false);

    this.remove = function () {
        that.element.removeEventListener('touchstart', _onDown);
        that.element.removeEventListener('touchend', _onUp);
        that.element.removeEventListener('mousedown', _onDown);
        that.element.removeEventListener('mouseup', _onUp);
        that.element = null;
    };
};

SwipeDetect.prototype.onDown = function (e) {
    if (e instanceof TouchEvent) {
        this.xDown = e.changedTouches[0].clientX;
        this.yDown = e.changedTouches[0].clientY;
    } else {
        this.xDown = e.clientX;
        this.yDown = e.clientY;
    }
};

SwipeDetect.prototype.onUp = function (e) {
    var xUp;
    var yUp;

    if (e instanceof TouchEvent) {
        xUp = e.changedTouches[0].clientX;
        yUp = e.changedTouches[0].clientY;
    } else {
        xUp = e.clientX;
        yUp = e.clientY;
    }

    var xDiff = Math.abs(this.xDown - xUp);
    var yDiff = Math.abs(this.yDown - yUp);

    var cbParams;

    if (xDiff > yDiff) {
        cbParams = { amount: xDiff, event: e };

        if (xDiff > this.thresholdX) {
            if (this.xDown > xUp) {
                this.onWest && this.onWest(cbParams);
            } else {
                this.onEast && this.onEast(cbParams);
            }
        }

    } else {
        cbParams = { amount: yDiff, event: e };

        if (yDiff > this.thresholdY) {
            if (this.yDown > yUp) {
                this.onNorth && this.onNorth(cbParams);
            } else {
                this.onSouth && this.onSouth(cbParams);
            }
        }
    }

    this.xDown = null;
    this.yDown = null;
};

// Module compatible
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SwipeDetect;
} else if (typeof define === 'function' && define.amd) {
    define(function () {
        return SwipeDetect;
    });
} else {
    window.SwipeDetect = SwipeDetect;
}
