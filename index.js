(function () {
    'use strict';

    var ChanceDailyAddType;
    (function (ChanceDailyAddType) {
        ChanceDailyAddType[ChanceDailyAddType["Days"] = 0] = "Days";
        ChanceDailyAddType[ChanceDailyAddType["ShortVideo"] = 1] = "ShortVideo";
        ChanceDailyAddType[ChanceDailyAddType["LongVideo"] = 2] = "LongVideo";
        ChanceDailyAddType[ChanceDailyAddType["DaysAndShortVideo"] = 3] = "DaysAndShortVideo";
    })(ChanceDailyAddType || (ChanceDailyAddType = {}));
    var getDailyValueByType = function (type) {
        switch (type) {
            case ChanceDailyAddType.Days:
            case ChanceDailyAddType.ShortVideo:
                return 5;
            case ChanceDailyAddType.LongVideo:
            case ChanceDailyAddType.DaysAndShortVideo:
                return 10;
        }
    };
    var Chance = /** @class */ (function () {
        function Chance() {
            this._value = 50;
            this.roll = null;
            this.canRelease = null;
            var existingChance = localStorage.getItem('chance');
            if (existingChance) {
                this._value = +existingChance;
            }
        }
        Object.defineProperty(Chance.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (newValue) {
                if (newValue < 0) {
                    this._value = 0;
                }
                else if (newValue > 50) {
                    this._value = 50;
                }
                else {
                    this._value = newValue;
                }
                localStorage.setItem('chance', this._value.toString());
            },
            enumerable: false,
            configurable: true
        });
        Chance.prototype.forgot = function () {
            this.value = 0;
        };
        Chance.prototype.handleDaily = function (type) {
            var dailyValue = getDailyValueByType(type);
            this.value += dailyValue;
        };
        Chance.prototype.handleRelease = function () {
            this.value -= 10;
        };
        Chance.prototype.rollForRelease = function () {
            this.roll = Math.floor(Math.random() * 99) + 1;
            this.canRelease = this.roll <= this.value;
            if (this.canRelease) {
                this.handleRelease();
            }
        };
        return Chance;
    }());

    var Days = /** @class */ (function () {
        function Days() {
            this._days = 0;
            this._consecutiveDays = 0;
            var existingDays = localStorage.getItem('days');
            if (existingDays) {
                this._days = +existingDays;
            }
            var existingConsecutiveDays = localStorage.getItem('consecutive_days');
            if (existingConsecutiveDays) {
                this._consecutiveDays = +existingConsecutiveDays;
            }
        }
        Object.defineProperty(Days.prototype, "days", {
            get: function () {
                return this._days;
            },
            set: function (newDays) {
                this._days = newDays;
                localStorage.setItem('days', this._days.toString());
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Days.prototype, "consecutiveDays", {
            get: function () {
                return this._consecutiveDays;
            },
            set: function (newConsecutiveDays) {
                this._consecutiveDays = newConsecutiveDays;
                localStorage.setItem('consecutive_days', this._consecutiveDays.toString());
            },
            enumerable: false,
            configurable: true
        });
        Days.prototype.add = function (isConsecutive) {
            this.days++;
            if (isConsecutive) {
                this.consecutiveDays++;
            }
            else {
                this.consecutiveDays = 0;
            }
        };
        Days.prototype.canUseDays = function () {
            return this.days >= 7 || this.consecutiveDays >= 5;
        };
        Days.prototype.resetDays = function () {
            this.days = 0;
            this.consecutiveDays = 0;
        };
        return Days;
    }());

    var chance = new Chance();
    var days = new Days();
    var btnRoll = document.getElementById('btnRoll');
    var btnAddDay = document.getElementById('btnAddDay');
    var btnAddConsecutiveDay = document.getElementById('btnAddConsecutiveDay');
    var btnUseDays = document.getElementById('btnUseDays');
    var btnVideoShort = document.getElementById('btnVideoShort');
    var btnVideoLong = document.getElementById('btnVideoLong');
    var btnBoth = document.getElementById('btnBoth');
    var btnForgot = document.getElementById('btnForgot');
    var bodyEl = document.getElementById('body');
    var chanceEl = document.getElementById('chance');
    var canReleaseEl = document.getElementById('canRelease');
    var daysEl = document.getElementById('days');
    var consecutiveDaysEl = document.getElementById('consecutiveDays');
    var hrUseDaysEl = document.getElementById('hrUseDays');
    var updateScreen = function () {
        chanceEl.innerHTML = chance.value.toFixed(0) + "%";
        daysEl.innerHTML = days.days.toString();
        consecutiveDaysEl.innerHTML = days.consecutiveDays.toString();
        if (chance.canRelease !== null) {
            if (chance.canRelease) {
                bodyEl.classList.remove('bg-red');
                bodyEl.classList.add('bg-green');
            }
            else {
                bodyEl.classList.add('bg-red');
                bodyEl.classList.remove('bg-green');
            }
        }
        if (days.canUseDays()) {
            btnUseDays.classList.remove('hidden');
            btnUseDays.classList.add('inline');
            btnBoth.classList.remove('hidden');
            btnBoth.classList.add('inline');
            hrUseDaysEl.classList.remove('hidden');
            hrUseDaysEl.classList.add('inline');
        }
        else {
            btnUseDays.classList.add('hidden');
            btnUseDays.classList.remove('inline');
            btnBoth.classList.add('hidden');
            btnBoth.classList.remove('inline');
            hrUseDaysEl.classList.add('hidden');
            hrUseDaysEl.classList.remove('inline');
        }
    };
    btnRoll.addEventListener('click', function () {
        var canRelease = chance.rollForRelease();
        canReleaseEl.innerHTML = chance.canRelease ? 'YES!' : 'NO!';
        updateScreen();
    });
    btnAddDay.addEventListener('click', function () {
        days.add(false);
        updateScreen();
    });
    btnAddConsecutiveDay.addEventListener('click', function () {
        days.add(true);
        updateScreen();
    });
    btnUseDays.addEventListener('click', function () {
        days.resetDays();
        chance.handleDaily(ChanceDailyAddType.Days);
        updateScreen();
    });
    btnVideoShort.addEventListener('click', function () {
        chance.handleDaily(ChanceDailyAddType.ShortVideo);
        updateScreen();
    });
    btnVideoLong.addEventListener('click', function () {
        chance.handleDaily(ChanceDailyAddType.LongVideo);
        updateScreen();
    });
    btnBoth.addEventListener('click', function () {
        chance.handleDaily(ChanceDailyAddType.DaysAndShortVideo);
        updateScreen();
    });
    btnForgot.addEventListener('click', function () {
        chance.forgot();
        days.resetDays();
        updateScreen();
    });
    updateScreen();

}());
//# sourceMappingURL=index.js.map
