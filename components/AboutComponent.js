import React, { Component } from "react";
import { ScrollView, Text, FlatList } from "react-native";
import { Card, ListItem } from "react-native-elements";
import { LEADERS } from "../shared/leaders";

function RenderHistory() {
    return (
        <Card title="Our History">
            <Text>
                Started in 2010, Ristorante con Fusion quickly established itself as a
                culinary icon par excellence in Hong Kong. With its unique brand of
                world fusion cuisine that can be found nowhere else, it enjoys patronage
                from the A-list clientele in Hong Kong. Featuring four of the best
                three-star Michelin chefs in the world, you never know what will arrive
                on your plate the next time you visit us. 
            </Text>
            <Text></Text>
            <Text>
                The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our
                CEO, Mr. Peter Pan, that featured for the first time the world's bestcuisines in a pan.
            </Text>
        </Card>
    );
}

function RenderLeaders() {
    
    const renderLeadersItem = ({ item, index }) => {
    
    return (
        <ListItem
            key={index}
            title={item.name}
            subtitle={item.description}
            leftAvatar={{ source: require("./images/alberto.png") }}
        />
    );
};
    return (
        <Card title="Corporate Leadership">
            <FlatList
                data={LEADERS}
                renderItem={renderLeadersItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </Card>
    );
}

class About extends Component {
    static navigationOptions = {
        title: "About Us",
    };

    render() {
        return (
            <ScrollView>
                <RenderHistory />
                <RenderLeaders />
            </ScrollView>
        );
    }
}

export default About;