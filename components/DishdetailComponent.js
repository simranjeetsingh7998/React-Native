import React,{Component} from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet, TouchableHighlight, Alert, PanResponder, Share } from 'react-native';
import { Card,Icon,Input } from 'react-native-elements';
import {connect } from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {postFavorite,postComment} from '../redux/ActionCreators';
import {Rating} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return  {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment:(dishId,rating,author,comment) => dispatch(postComment(dishId,rating,author,comment))
})

function RenderDish(props) {
    const dish= props.dish;

    handleViewRef = ref => this.view = ref;
    
    const recognizeDarg= ({ moveX, moveY, dx, dy }) => {
        if (dx < -200 )
            return true;
        else 
            return false;
    };

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if(dx > 200 )
            return true;
        else 
            return false;
    };
    
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'finished' : 'cancelled' ))
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDarg(gestureState)) 
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add ' + dish.name + ' to your favorites?',
                    [
                        {
                            text:'cancel',
                            onPress: () =>console.log('cancel pressed'),
                            style: 'cancel'
                        }, 
                        {
                            text:'OK',
                            onPress: () =>  props.favorite ? console.log('Already favorite') : props.onPress()
                        }
                    ],
                    {cancelable: false}
                )
            else if(recognizeComment(gestureState))
                props.toggleModal();
            return true;
        }
    });

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        }, {
            dialogTitle: 'Share ' + title
        });
    }

    if(dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handleViewRef}
            {...panResponder.panHandlers} >
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{
                        flex:1,
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart': 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() =>  props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                        <Icon 
                            raised
                            reverse
                            name= 'pencil'
                            type= 'font-awesome'
                            color= '#512DA8'
                            onPress={() => props.toggleModal()}
                            />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                            />    
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (
            <View></View>
        );
    }
}
function RenderComments(props) {
    const comments=props.comments

    const RenderCommentItem=({item,index}) => {
        return(
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize:14}}>
                    {item.comment}
                </Text>
                <Rating imageSize={12} readonly startingValue={item.rating} style={{margin:2,alignItems: 'flex-start'}} />
                <Text style={{fontSize:12}}>
                    {'-- '+item.author+', '+ new Date(item.date).toLocaleDateString()}
                </Text>
            </View>
        );
    }
    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={RenderCommentItem}
                    keyExtractor={item=> item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating:0,
            author: '',
            comment: ''
        };
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }

    handleSubmit(dishId){
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment)
        this.toggleModal();
    }
    
    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    
    render() {
        
        const dishId= this.props.navigation.getParam('dishId','');

        return(
        <>
        <ScrollView>
            <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                favorite={this.props.favorites.some(el => el === dishId)}
                onPress={()=> this.markFavorite(dishId)}
                toggleModal={() => this.toggleModal()}
                
            />
            <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />   
        </ScrollView>

        <Modal
            animationType={'slide'}
            transparent={false}
            visible={this.state.showModal}
            onDismiss={() => this.toggleModal()}
            onRequestClose={() => this.toggleModal()}
            >
                <View>
                    <Rating
                        showRating
                        onFinishRating={(value) => this.setState({rating:value})}
                        style={{ paddingVertical: 10 }}
                    />
                    <Input
                        placeholder=" Author"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(value) => this.setState({author: value})}
                    />
                    <Input
                        placeholder=" Comment"
                        leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                        onChangeText={(value) => this.setState({comment: value})}
                    />
                    <TouchableHighlight style = {styles.buttonFormWrapping} 
                                    onPress = {() => this.handleSubmit(dishId)}>
                        <Text style = {styles.buttonFormText}>Submit</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style = {{...styles.buttonFormWrapping,backgroundColor : "grey"}}
                                     onPress = {() =>{this.toggleModal()}}>
                        <Text style = {styles.buttonFormText} >Cancel</Text>
                    </TouchableHighlight>
                </View>
        </Modal>
        </>
        );
    }
}

const styles = StyleSheet.create({
    buttonRow : {
        justifyContent : 'center',
        alignItems: 'center',
        flexDirection : 'row'
    },
    buttonFormWrapping : {
        backgroundColor:"#512DA8",
        padding: 10,
        borderRadius: 1,
        margin: 10,
        shadowColor: "#000",
    },
    buttonFormText : {
        color: "white",
        fontWeight : "bold",
        textAlign : "center",
        fontSize : 18
    }
})
export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);