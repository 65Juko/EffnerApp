import React, {useEffect, useState} from "react";

import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {ThemePreset} from "../../theme/ThemePreset";
import {Themes} from "../../theme/ColorThemes";
import {maxTimetableDepth, normalize} from "../../tools/helpers";
import {getWeekDay} from "../../tools/helpers";
import {getCellColor} from "../../theme/TimetableThemes";
import {save, load} from "../../tools/storage";

export default function WeekView({timetable, theme: timetableTheme, editModeEnabled, onRequestEditItem = () => null}) {
    const {theme, globalStyles, localStyles} = ThemePreset(createStyles);

    const [currentDepth, setCurrentDepth] = useState(0);

    useEffect(() => {
        setCurrentDepth(maxTimetableDepth(timetable));
    }, [timetable]);

    return (
        <View style={localStyles.timetable}>
            <View style={localStyles.timetableTimeColumnEntry}>
                <View>
                    <Text style={[globalStyles.text]}> </Text>
                </View>
                {[...Array(currentDepth).keys()].map(i => (
                    <View key={i} style={[localStyles.timetableTimeEntry]}>
                        <Text style={[globalStyles.text, localStyles.timetableEntryText, localStyles.textBoldCenter]}>
                            {i + 1}
                        </Text>
                    </View>
                ))}
            </View>

            {timetable &&
                [...Array(5).keys()].map(i => (
                    <View key={i} style={localStyles.timetableDayEntry}>
                        <View>
                            <Text style={[globalStyles.text, localStyles.textBoldCenter]}>
                                {getWeekDay(i)}
                            </Text>
                        </View>
                        {timetable?.lessons[i].filter((lesson, j) => j < currentDepth)
                            .map((subject, j) => (
                                <TouchableOpacity key={j} disabled={!editModeEnabled} onPress={() => onRequestEditItem({day: i, lesson: j})} style={[localStyles.timetableEntry, {backgroundColor: getCellColor(timetableTheme, {meta: timetable.meta, subject})}]}>
                                    {/* for the correct cell-size, we need to put at least a single space if the cell should be empty */}
                                    <Text style={[globalStyles.text, localStyles.timetableEntryText]}>
                                        {subject || " "}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                ))}
        </View>
    );
}

const createStyles = (theme = Themes.light) =>
    StyleSheet.create({
        timetable: {
            flexDirection: "row",
            justifyContent: "center"
        },
        timetableDayEntry: {
            flexDirection: "column",
            width: "18%",
        },
        timetableEntry: {
            borderWidth: 1.3,
            borderColor: theme.colors.onSurface,
            padding: 8,
            margin: 1,
            height: "14%"
        },
        timetableEntryText: {
            fontSize: normalize(12, 24),
            textAlign: "center",
        },
        timetableTimeColumnEntry: {
            flexDirection: "column"
        },
        timetableTimeEntry: {
            borderWidth: 1.3,
            borderColor: theme.colors.background,
            padding: 8,
            margin: 1,
            height: "14%"
        },
        textBoldCenter: {
            fontWeight: "bold",
            textAlign: "center"
        },
    });
