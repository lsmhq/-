import Axios from 'axios';
import React, { Component } from 'react';
export default class Test extends Component {
    constructor(){
        super();
        this.state = {
            //试卷类型
            type:{
                final:'Final',
                normal:'Chapter'
            },
            //期末
            page_id:'',
            id:'',
            //章节
            lesson_id:'',
            //答题卡,题目
            data_list:[],
            //返回后台答案
            answer_list:[],
            //渲染
            list:[],
            question_num:0,
            nowQuestData:{},
            questType:['','单选','多选',"判断"],
            len:1
        }
    }
    componentDidMount(){
        

        //获取试题
        // console.log(this.props.match.params.id.split('&')[1]);
        if(this.props.match.params.id.split('&')[1] == 'normal'){
            // console.log({
            //     lessonId:this.props.match.params.id.split('&')[0]
            // });
            //请求章节数据
            Axios({
                url:`/api/student/examination/getChapterExamScoreDetail`,
                method:'POST',
                data:{
                    id:this.props.match.params.id.split('&')[0]
                },
                headers:{
                    Authorization:localStorage.getItem('userId')
                }
            }).then(res=>{
                // console.log(res);
                                //初始化题目
                                if(res.data.code == 500){
                                    alert(res.data.msg);
                                    window.location.hash = '/Mine';
                                }
                                else{               
                                    this.setState({
                                        data_list:JSON.parse(res.data.data.question_list),
                                        len:JSON.parse(res.data.data.question_list).length
                                    },()=>{
                                        let question_list = [];
                                        // console.log(this.state.data_list);
                                        this.state.data_list.map(val=>{
                                            val.question_array.map(val1=>{
                                                // val1.isAuswered = false;
                                                val1.selectList.map(val2=>{
                                                    val2.checked = false;
                                                })
                                                if(val1.answer_right){
                                                    eval(val1.answer_right).map(val3=>{
                                                        val1.selectList.map(val2=>{
                                                            if(val3 == val2.select_id){
                                                                console.log(val2,val3);
                                                                 val2.checked = true;
                                                            }
                                                        })
                                                    })
                                                    console.log(this.state.data_list);
                                                }
                                                question_list.push(val1);
                                            })
                                        })
                                        this.setState({
                                            data_list:question_list,
                                            len:question_list.length-1
                                        },()=>{
                                            // console.log(this.state.data_list);
                                        });
                                    })
                                }
            });
        }else if(this.props.match.params.id.split('&')[1] == 'final'){
            //请求期末数据
            // console.log({
            //     id:this.props.match.params.id.split('&')[0].split('$')[1],
            //     page_id:this.props.match.params.id.split('&')[0].split('$')[0]
            // });
            Axios({
                url:'/api/student/examination/getFinalExamScoreDetail',
                method:'POST',
                data:{
                    id:this.props.match.params.id.split('&')[0]
                },
                headers:{
                    Authorization:localStorage.getItem('userId')
                }
            }).then(res=>{
                //初始化题目
                if(res.data.code == 500){
                    alert(res.data.msg);
                    window.location.hash = '/Mine';
                }
                else{
                    // console.log(res);
                    this.setState({
                        data_list:JSON.parse(res.data.data.question_list),
                        len:JSON.parse(res.data.data.question_list).length
                    },()=>{
                        let question_list = [];
                        // console.log(this.state.data_list);
                        this.state.data_list.map(val=>{
                            val.question_array.map(val1=>{
                                console.log(val1);
                                if(val1.user_answer){
                                    val1.user_answer.map(val3=>{
                                        val1.selectList.map(val2=>{
                                            val2.checked = false;
                                            if(val3 == val2.select_id){
                                                 val2.checked = true;
                                            }
                                        })
                                    })
                                }
                                question_list.push(val1);
                            })
                        })
                        this.setState({
                            data_list:question_list
                        },()=>{
                            console.log(this.state.data_list);
                        });
                    })
                }
            })
        }
    }
    render() {
        console.log(this.state.data_list);
        if(this.state.data_list.length > this.state.len)
        return(
            <div style = {{display:'flex',flexDirection:'column',height:'100%'}}>
            {/* <List/> */}
            <div style = {{
                height:'20%',
                display:'flex',
                flexDirection:'column'
            }}>
                <div 
                    className = 'title'
                    style = {{
                        display:'flex',
                        marginTop:'5%'
                    }}
                >
                    <span style={{width:"40%",marginLeft:'5%'}}>
                        {`[${this.state.question_num+1}][${this.state.questType[this.state.data_list[this.state.question_num].question_class?this.state.data_list[this.state.question_num].question_class:'1']}]`}
                    </span>
                    {/* <span>{`剩余时间:${this.time(localStorage.getItem('time'))}`}</span> */}
                </div>
                <div 
                    className = 'question'
                    style = {{
                        width:'100%'
                    }}
                >
                    <p style={{marginLeft:'5%',fontSize:'20px'}}>{this.state.data_list[this.state.question_num].context}</p>
                </div>
            </div>
            <ul style= {{
                height:'70%',
                width:'100%'
            }}>
                {
                    //选择题选项
                    this.state.data_list[this.state.question_num].selectList.map(
                        (val,idx)=>{
                            // console.log(val);
                            if(this.state.data_list[this.state.question_num].question_class == 1)
                            return(
                                <li>
                                    <input 
                                        id={val.select_id} 
                                        name={idx} 
                                        class="check1" 
                                        checked = {val.checked} 
                                        type="radio" 
                                        value={val.select_content}

                                    />
                                    <label for={val.select_id} class="radio-label" style={{display:'flex',alignItems:'center'}}>
                                        <span style={{width:'10%',marginTop:'5%',color:'#0076ce'}}>{val.select_name}、</span>
                                        <span style={{width:"80%",marginTop:'5%',fontSize:'20px'}}>{val.select_content}</span> 
                                    </label>
                                </li>
                            )
                            else if(this.state.data_list[this.state.question_num].question_class == 2)
                            return(
                                <li>
                                    <input id={val.select_id} class="check1" type="checkbox"  name={idx} value={val.select_content} checked = {val.checked}/>
                                    <label for={val.select_id} class="radio-label" >
                                        <span style={{width:'10%',color:'#0076ce',position:'relative',top:'15px'}}>{val.select_name}、</span>
                                        <span style={{width:"60%",fontSize:'20px',position:'relative',top:'15px'}}>{val.select_content}</span> 
                                    </label>
                                </li>
                            )
                            else if(this.state.data_list[this.state.question_num].question_class == 3)
                            return(
                                <li>
                                    <input id={val.select_id} class="check1" type="radio" name={idx} value={val.select_content} checked = {val.checked}/>
                                    <label for={val.select_id} class="radio-label" style={{display:'flex',alignItems:'center'}}>
                                        <span style={{width:'10%',marginTop:'5%',color:'#0076ce'}}>{val.select_name}、</span>
                                        <span style={{width:"80%",marginTop:'5%',fontSize:'20px'}}>{val.select_content}</span> 
                                    </label>
                                </li>
                            )
                        }
                    )
                }
            </ul>
            <div 
                style={{
                    display:'flex',
                    width:'100%',
                    height:'20%',
                    backgroundColor:'white',
                    alignItems:'center',
                    justifyContent:'center'
                }}
            >
                <span style={{width:'50%',textAlign:'center'}}>{`正确答案:${this.answer(this.state.data_list[this.state.question_num].answer_right,this.state.data_list[this.state.question_num].selectList)}`}</span>
                <span style={{width:'50%',textAlign:'center'}}>{`你的答案:${this.answer(this.state.data_list[this.state.question_num].user_answer?this.state.data_list[this.state.question_num].user_answer:[],this.state.data_list[this.state.question_num].selectList)}`}</span>
            </div>
            <div 
                className = "test_foot"
                style={{
                    display:'flex',
                    width:'100%',
                    height:'10%',
                    backgroundColor:'white',
                    alignItems:'center',
                    justifyContent:'center',
                    borderTop:"1px solid rgb(196, 196, 196)"
                }}
            >   
                <span style={{
                    width:'30%',
                    display:'flex',
                    height:"100%",
                    alignItems:'center'
                }}
                    onTouchEnd = {(e)=>{
                        this.last(e);
                    }}
                >
                    <span style={{fontSize:"25px",height:'100%',lineHeight:'270%',color:"#cdcdcd",fontWeight:"700",marginLeft:'5%'}}>
                        {'⋘'}
                    </span>
                    <span
                        style={{height:'100%',lineHeight:"450%",color:"#cdcdcd",fontWeight:"700",marginLeft:'10%'}}
                    >上一题</span>
                </span>
                <span style={{
                    width:"40%",
                    textAlign:'center',
                    height:'100%',
                    display:'flex',
                    flexDirection:'column'
                }}
                >
                    <span style={{backgroundColor:' #33a6ff',width:'40%',marginLeft:'30%',borderRadius:'10px',color:'white',marginTop:'5%'}}>{this.state.question_num+1}/{this.state.data_list.length}</span>
                    {/* <span style={{marginTop:"10%",color:' #33a6ff'}}>答题卡-交卷</span> */}
                </span>
                <span style={{
                    width:'30%',
                    display:'flex',
                    height:'100%',
                    alignItems:'center',
                    justifyContent:'center'
                }}
                    onTouchEnd = {(e)=>{
                        this.next(e);
                    }}
                >
                    <span style={{height:'100%',lineHeight:"450%",color:"#cdcdcd",fontWeight:"700",marginRight:'10%'}}>下一题</span>
                    <span style={{fontSize:"25px",height:'100%',lineHeight:'270%',color:"#cdcdcd",fontWeight:"700",marginRight:'5%'}}>{'⋙'}</span>
                </span>
            </div>
        </div>
        )
        else
        return(
            <div>加载中</div>
        )
    }

    next = ()=>{
        // console.log('下一个');
        // console.log(this.state.question_num + 2>=this.state.data_list.length?'0':1);
        this.setState({
            question_num:this.state.question_num + 2>this.state.data_list.length?this.state.question_num :this.state.question_num + 1
        })
    }
    last = ()=>{
        // console.log('上一个');
        this.setState({
            question_num:this.state.question_num  <= 0?0:this.state.question_num - 1
        });
    }
    answer = (arr,brr)=>{
        let j = 0,str = '';
        brr.map(val=>{
            eval(arr).map(val1=>{
                
                if(val1 == val.select_id){
                    // console.log(val,val1);
                    str += ' '+val.select_name
                    // console.log(str);
                }
            })
        })
        return str;
    }
}

