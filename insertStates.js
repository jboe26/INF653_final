require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./models/States');

const insertStates = async () => {
    await mongoose.connect(process.env.MONGO_URI);

    const states = [
        {
            stateCode: "KS",
            funfacts: [
                "Kansas is the Wheat State.",
                "Kansas has more cows than people.",
                "The geographic center of the contiguous U.S. is in Kansas."
            ]
        },
        {
            stateCode: "MO",
            funfacts: [
                "Missouri is known as the Show-Me State.",
                "The Gateway Arch is in St. Louis, Missouri.",
                "Missouri has more than 6,000 known caves."
            ]
        },
        {
            stateCode: "OK",
            funfacts: [
                "Oklahoma has the most tornadoes of any state.",
                "The parking meter was invented in Oklahoma City.",
                "Oklahoma is home to the largest Native American population."
            ]
        },
        {
            stateCode: "NE",
            funfacts: [
                "Nebraska has more miles of rivers than any other state.",
                "Nebraska's state insect is the honeybee.",
                "The Kool-Aid drink was invented in Nebraska."
            ]
        },
        {
            stateCode: "CO",
            funfacts: [
                "Colorado has the highest average elevation of any state.",
                "The world's largest flat-top mountain is in Colorado.",
                "Colorado is the only state to have turned down hosting the Olympics."
            ]
        }
    ];

    for (const state of states) {
        await State.findOneAndUpdate(
            { stateCode: state.stateCode },
            state,
            { upsert: true, new: true }
        );
    }

    console.log("States inserted successfully!");
    mongoose.connection.close();
};

insertStates().catch(err => console.error(err));
