import React, { PropTypes, Component } from 'react';

class Countdown extends Component {
    constructor(props) {
        super(props);

        this.state = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            complete:false
        }
    }

    componentDidMount() {
        // update every second
        this.interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.date,this.props.daysInHours);
            date ? this.setState(date) : this.stop();
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    calculateCountdown(endDate,daysInHours) {

        let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;


        // clear countdown when date is reached
        if (diff < 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
            millisec: 0,
        };

        // calculate time difference between now and expected date
        if (diff >= (365.25 * 86400)) { // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) { // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) { // 60 * 60
            if(daysInHours){
                timeLeft.hours = Math.floor(diff / 3600) + timeLeft.days * 24;
            }else{
                timeLeft.hours = Math.floor(diff / 3600);
            }
            const hours = Math.floor(diff / 3600);
            diff -= hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;

        return timeLeft;
    }

    stop() {
        this.setState({complete:true});
        clearInterval(this.interval);
    }

    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = '0' + value;
        }
        return value;
    }

    render() {
        const {days,hours,min,sec,complete} = this.state;

        return (
            <div className="Countdown">
                {this.props.render(this.addLeadingZeros(days),this.addLeadingZeros(hours),this.addLeadingZeros(min),this.addLeadingZeros(sec),complete)}

            </div>
        );
    }
}

Countdown.propTypes = {
    date: PropTypes.string.isRequired
};

Countdown.defaultProps = {
    date: new Date(),

};

export default Countdown;