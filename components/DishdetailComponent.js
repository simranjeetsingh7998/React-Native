import React,{Component} from 'react';
import { View, Text,ScrollView, FlatList,Modal,Button,StyleSheet,TouchableHighlight } from 'react-native';
import { Card,Icon,Input,Rating } from 'react-native-elements';
import {connect } from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import {postFavorite,postComment} from '../redux/ActionCreators';

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
    const dish = props.dish;
    

    if(dish != null) {
        return (
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
                </View>
            </Card>
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
                <Rating imageSize={12} readonly startingValue={item.rating} style={{margin: 10 , alignItems: 'flex-start'}} />
                <Text style={{fontSize:12}}>
                    {'-- '+item.author+', '+ new Date(item.date).toLocaleDateString()}
                </Text>
            </View>
        );
    }
    return(
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={RenderCommentItem}
                keyExtractor={item=> item.id.toString()}
            />
        </Card>
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
        title: 'Dish Detials'
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
                                    onPress = {() => this.handleSubmit()}>
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
        marginTop: 5,
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