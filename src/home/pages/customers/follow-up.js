import React, { Component } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { Form, Input, Button, Tab } from "beeshell";

// 数据
import {
  tabData,
  followItemHash,
  newLevelHash,
  followStyleHash,
  lostReasonHash,
} from "../../data-config";
import {
  followUpFirst,
  followUp,
  followUpLost,
  followUpValidate,
} from "./validator";
import {
  RequiredLabel,
  ErrorMsg,
  SelectLabel,
  DatePicker,
} from "../../../common/components/form";
import { CustomerBg, ButtonWrapper } from "./style";
import variables from "../../../style/beeshell";

// 底部选择组件
import FollowItem from "./form/follow-item";
import FollowStyle from "./form/follow-style";
import NewLevel from "./form/new-level";
import LostReason from "./form/lost-reason";

// 用户信息
import FollowUpUserInfo from "./components/follow-up-user-info";
import FollowUpHistoryList from "./components/follow-up-history-list";
import { size } from "../../../style/variables";
import { forEach } from "lodash";

import { getEndDate } from "./util";

export default class FollowUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        followItem: "1",
        followStyle: "2",
        newCustlevel: "",
        followReasult: "",
        planFollowItem: "6",
        planFollowStyle: "1",
        planFollowTime: "",
      },
      level: "1",
      lost: false,
      followPlan: null,
      validateResults: {},
      customer: {},
      loading: false,
      editable: true,
    };
  }

  // 生命周期挂载阶段
  componentDidMount() {
    // 获取参数
    const { navigation } = this.props;
    const customerNo = navigation.getParam("customerNo");
    this.customerNo = customerNo;
    // 处理异常情况
    if (!customerNo) {
      Alert.alert("提示", "客户资料异常，没有customerNo");
      this.props.navigation.navigate("App");
      return;
    }

    // 获取是否跟进计划
    axios
      .get("/admin/satCustomerFollow/getWaitFollowsByNo", {
        params: { customerNo },
      })
      .then(({ data }) => {
        if (!data.length) return;
        const followPlan = data[0]
        this.setState({
          followPlan: { ...followPlan },
          user:followPlan
        },()=>{
          // 对有值的必填项进行自动校验
          let requiredForm;
          // 根据条件判断
          if (followPlan.newCustlevel == "7") {
            requiredForm = followUpLost;
          } else {
            requiredForm = followUp;
          }
          forEach(requiredForm, (e) => {
            if(!followPlan[e]) return
            this.handleChange(e, this.state.user[e]);
          });
        });
      });

    // 查询该客户是否处于战败申请中
    axios
      .get("/admin/satLostApply/lostStatus", { params: { customerNo } })
      .then(({ data }) => {
        // 设置战败属性函数供跟进历史查询
        if (data) this.setState({ lost: true });
      });
  }

  // 表单值变化回调
  handleChange(key, value) {
    let ret;
	//去掉描述结果emjo表情
    if (key == "memo" || key == "followReasult") {
      let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
      if (regStr.test(value)) {
        value = value.replace(regStr, "");
      }
    }
    followUpValidate(key, value, (tmp) => {
      ret = tmp;
    });
    this.setState((prevState) => {
      return {
        user: {
          ...prevState.user,
          [key]: value,
        },
        validateResults: { ...prevState.validateResults, [key]: ret },
      };
    });
  }
  // 当是电商是锁定表单
  lockForm() {
    this.setState({ editable: false });
  }

  // 设置计划跟进时间
  setPlanTime(level) {
    this.setState({
      level,
      endDate: getEndDate(level),
    });
  }

  // 点击切换tab
  touchTab(v, value) {
    const { navigation } = this.props;
    switch (value) {
      case 1:
        this.props.navigation.navigate("Customers", {
          customerNo: navigation.getParam("customerNo"),
        });
        break;
      case 3:
        this.props.navigation.navigate("CreatOrder", {
          customerNo: navigation.getParam("customerNo"),
        });
        break;
      default:
        return;
    }
  }

  // 保存信息
  save() {
    // 验证数据
    let flag = false;
    let requiredForm;
    // 根据条件判断
    if (!this.state.followPlan) {
      requiredForm = followUpFirst;
    } else {
      if (this.state.user.newCustlevel == "7") {
        requiredForm = followUpLost;
      } else {
        requiredForm = followUp;
      }
    }
    forEach(requiredForm, (e) => {
      const result = this.state.validateResults[e];
      // validateResults 不存在，则是未改变
      if (!result) {
        // 进行验证
        flag = true;
        this.handleChange(e, this.state.user[e]);
      }
      // 存在且valid 为false 返回
      if (result && !result.valid) {
        flag = true;
      }
    });
    if (flag) return;
    this.setState({ loading: true });
    // 保存用户意向信息 如果有跟进计划
    if (this.state.followPlan) {
      // 存在跟进计划，则使用跟进完成API
      let formData = { ...this.state.user };
      if (this.state.user.planFollowTime) {
        formData.planFollowTime = moment(this.state.user.planFollowTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      formData.customerNo = this.customerNo;
      formData.followId = this.state.followPlan.followId;
      axios
        .post("/admin/satCustomerFollow/complete", formData)
        .then(() => {
          // 保存成功 刷新跟进历史
          // 置空表单
          Alert.alert("提示", "本次信息保存成功.");
          this.setState({
            user: {},
            validateResults: {},
          });
          this.props.navigation.goBack();
        })
        .finally(() => this.setState({ loading: false }));
    } else {
      // 没有跟进计划则是第一次
      let formData = { ...this.state.user };
      if (this.state.user.planFollowTime) {
        formData.planFollowTime = moment(this.state.user.planFollowTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      formData.customerNo = this.customerNo;
      formData.newCustlevel = this.state.level;
      axios
        .post("/admin/satCustomerFollow/save", formData)
        .then(({ data }) => {
          Alert.alert("提示", "本次信息保存成功.");
          this.setState({
            user: {},
            validateResults: {},
          });
          this.props.navigation.goBack();
        })
        .finally(() => this.setState({ loading: false }));
    }
  }

  // 首次跟进不显示意向级别
  renderCustlevel() {
    const { editable } = this.state;
    if (this.state.followPlan) {
      return (
        <Form.Item
          style={{ paddingVertical: 13 }}
          label={<RequiredLabel labelName="新意向级别" />}
          hasLine
        >
          <SelectLabel
            data={newLevelHash[this.state.user.newCustlevel]}
            editable={editable}
            onPress={() => this.NewLevel.open()}
          />
          <ErrorMsg
            validateResults={this.state.validateResults}
            name="newCustlevel"
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  }

  // 新意向级别选择战败后显示战败原因
  renderLost() {
    const { editable } = this.state;
    if (this.state.user.newCustlevel == "7") {
      return (
        <Form.Item
          style={{ paddingVertical: 13 }}
          label={<RequiredLabel labelName="战败原因" />}
          hasLine
        >
          <SelectLabel
            data={lostReasonHash[this.state.user.lostReason]}
            editable={editable}
            onPress={() => this.LostReason.open()}
          />
          <ErrorMsg
            validateResults={this.state.validateResults}
            name="lostReason"
          />
        </Form.Item>
      );
    } else {
      return null;
    }
  }

  // 战败后不显示跟进
  renderPlan() {
    const { editable } = this.state;
    if (this.state.user.newCustlevel == "7") {
      return null;
    } else {
      return (
        <View>
          <Text style={{ marginTop: 10, marginLeft: 15, color: "#000" }}>
            下次
          </Text>
          <Form.Item
            style={{ paddingVertical: 13 }}
            label={<RequiredLabel labelName="计划接触事项" />}
            labelWidth={100}
            hasLine
          >
            <SelectLabel
              data={followItemHash[this.state.user.planFollowItem]}
              editable={editable}
              onPress={() => this.PlanFollowItem.open()}
            />
            <ErrorMsg
              validateResults={this.state.validateResults}
              name="planFollowItem"
            />
          </Form.Item>

          <Form.Item
            style={{ paddingVertical: 13 }}
            label={<RequiredLabel labelName="计划接触方式" />}
            labelWidth={100}
            hasLine
          >
            <SelectLabel
              data={followStyleHash[this.state.user.planFollowStyle]}
              editable={editable}
              onPress={() => this.PlanFollowStyle.open()}
            />
            <ErrorMsg
              validateResults={this.state.validateResults}
              name="planFollowStyle"
            />
          </Form.Item>

          <Form.Item
            style={{ paddingVertical: 13 }}
            label={<RequiredLabel labelName="计划接触时间" />}
            labelWidth={100}
            hasLine
          >
            <SelectLabel
              data={this.state.user.planFollowTime}
              editable={editable}
              onPress={() => this.datePicker.open()}
            />
            <ErrorMsg
              validateResults={this.state.validateResults}
              name="planFollowTime"
            />
          </Form.Item>
          {/* 禁止表情输入 */}
          <Form.Item
            style={{ paddingVertical: 13 }}
            label="计划接触描述"
            labelWidth={100}
            hasLine
          >
            <Input
              testID="memo"
              value={this.state.user.memo}
              inputStyle={{ height: 80, textAlignVertical: "top" }}
              textAlign="right"
              multiline
              editable={editable}
              onChange={(value) => {
                this.handleChange("memo", value);
              }}
            />
          </Form.Item>
        </View>
      );
    }
  }

  // 处理战败
  renderLostForm() {
    const { editable } = this.state;
    return (
      <View>
        {this.state.lost === true ? (
          <View>
            <Text
              style={{
                fontSize: size.fontsizeMd,
                marginTop: 10,
                marginBottom: 5,
                paddingHorizontal: 15,
              }}
            >
              已申请战败
            </Text>
          </View>
        ) : null}
        <Form style={{ marginTop: 10 }}>
          <Text style={{ marginTop: 10, marginLeft: 15, color: "#000" }}>
            本次
          </Text>
          <Form.Item
            style={{ paddingVertical: 13 }}
            label={<RequiredLabel labelName="跟进事项" />}
            hasLine
          >
            <SelectLabel
              data={followItemHash[this.state.user.followItem]}
              editable={editable}
              onPress={() => this.FollowItem.open()}
            />
            <ErrorMsg
              validateResults={this.state.validateResults}
              name="followItem"
            />
          </Form.Item>

          <Form.Item
            style={{ paddingVertical: 13 }}
            label={<RequiredLabel labelName="跟进方式" />}
            hasLine
          >
            <SelectLabel
              data={followStyleHash[this.state.user.followStyle]}
              editable={editable}
              onPress={() => this.FollowStyle.open()}
            />
            <ErrorMsg
              validateResults={this.state.validateResults}
              name="followStyle"
            />
          </Form.Item>

          {this.renderCustlevel()}
          {this.renderLost()}
          {/* 禁止表情输入 */}
          <Form.Item
            style={{ paddingVertical: 13 }}
            label={<RequiredLabel labelName="跟进结果" />}
            hasLine
          >
            <Input
              testID="followReasult"
              value={this.state.user.followReasult}
              inputStyle={{ height: 80, textAlignVertical: "top" }}
              textAlign="right"
              multiline
              editable={editable}
              onChange={(value) => {
                this.handleChange("followReasult", value);
              }}
            />
            <ErrorMsg
              validateResults={this.state.validateResults}
              name="followReasult"
            />
          </Form.Item>
        </Form>
        <Form style={{ marginTop: 10 }}>{this.renderPlan()}</Form>
        <ButtonWrapper>
          <Button
            testID="submit"
            type="primary"
            disabled={this.state.loading || !editable}
            onPress={this.save.bind(this)}
          >
            保存
          </Button>
        </ButtonWrapper>
      </View>
    );
  }

  render() {
    return (
      <CustomerBg style={{ flex: 1, paddingTop: 10 }}>
        <ScrollView>
          <Tab
            value={2}
            data={tabData}
            onChange={(item) => this.touchTab("value", item.value)}
            activeColor={variables.mtdBrandPrimaryDark}
          />
          <FollowUpUserInfo
            customerNo={this.props.navigation.getParam("customerNo")}
            lockForm={() => this.lockForm()}
            setPlanTime={(level) => {
              if (!this.state.user.newCustlevel) {
                this.setPlanTime(level);
              }
            }}
          />
          {this.renderLostForm()}
          <FollowUpHistoryList
            ref={(c) => (this.FollowUpHistoryList = c)}
            customerNo={this.props.navigation.getParam("customerNo")}
          />
        </ScrollView>

        <FollowItem
          ref={(c) => (this.FollowItem = c)}
          rightCallback={(value) => this.handleChange("followItem", value)}
        />
        <FollowItem
          ref={(c) => (this.PlanFollowItem = c)}
          customerNo={this.props.navigation.getParam("customerNo")}
          rightCallback={(value) => this.handleChange("planFollowItem", value)}
        />
        <FollowStyle
          ref={(c) => (this.FollowStyle = c)}
          rightCallback={(value) => this.handleChange("followStyle", value)}
        />
        <FollowStyle
          ref={(c) => (this.PlanFollowStyle = c)}
          rightCallback={(value) => this.handleChange("planFollowStyle", value)}
        />
        <NewLevel
          ref={(c) => (this.NewLevel = c)}
          rightCallback={(value) => {
            this.handleChange("newCustlevel", value);
            this.setPlanTime(value);
          }}
        />
        <DatePicker
          ref={(c) => (this.datePicker = c)}
          endDate={this.state.endDate}
          numberOfYears={2}
          rightCallback={(value) => this.handleChange("planFollowTime", value)}
        />
        <LostReason
          ref={(c) => (this.LostReason = c)}
          rightCallback={(value) => this.handleChange("lostReason", value)}
        />
      </CustomerBg>
    );
  }
}
