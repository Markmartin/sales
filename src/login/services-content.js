import React, {Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {colors, size} from "../style/variables";
import {PrivacyTitle, PrivacyPart, PrivacyText} from './style'

export default class ServicesContent extends Component {

	render() {
		return (
			<View style={{flex: 1, backgroundColor: colors.white,paddingTop:10}}>
				<PrivacyTitle>服务协议</PrivacyTitle>
				<PrivacyPart>引言</PrivacyPart>
				<PrivacyText>
					爱驰汽车有限公司及其关联公司（以下亦称为“我们”或“爱驰”）感谢您使用 爱驰销售助手APP 社区功能，本功能基于 爱驰销售助手APP 使用，同样适用您在注册 爱驰销售助手APP
					时既以阅读、理解并同意接受的《隐私政策》 。本规范在《隐私政策》基础上，进一步向您说明：
				</PrivacyText>
				<PrivacyText>账号规范 </PrivacyText>
				<PrivacyText> 发布内容及评论规范 </PrivacyText>
				<PrivacyText> 授权许可</PrivacyText>


				<PrivacyPart>账号规范</PrivacyPart>
				<PrivacyText>
					用户注册 爱驰销售助手APP
					账号，制作、发布、传播信息内容的，应当使用真实身份信息及个人资料，不得以虚假、冒用的居民身份信息、企业注册信息、组织机构代码信息进行注册；若用户的个人资料有任何变动，用户应及时更新，任何非真实用户注册的账号都将被认定为违规账号。
				</PrivacyText>

				<PrivacyPart>1.1违规注册用户账号和违规获取积分</PrivacyPart>
				<PrivacyText>
					任何利用注册程序或违规手段进行注册的账号，我们会在核实验证之后对账号进行封禁处理。对于违规的积分获取、转移、消费等行为，在核实积分信息之后，我们会对其账号进行积分冻结并封禁。
				</PrivacyText>

				<PrivacyPart>1.2违规的用户头像、昵称以及个人介绍</PrivacyPart>
				<PrivacyText>
					在 爱驰销售助手APP 中，
					用户头像不得使用色情、血腥、暴力、国家政治相关等违规图片，也不得侵犯他人肖像权；昵称及个人简介不得使用无意义乱码、广告性质的ID等内容，多次违规的用户将被封禁处理。此外，请勿恶意修改/PS其他用户的头像、昵称和个人介绍，请勿通过上述方式对其他用户进行诋毁污蔑。
				</PrivacyText>

				<PrivacyPart>发布内容及评论规范</PrivacyPart>
				<PrivacyText>
					我们有权对用户使用 爱驰销售助手APP
					社区的行为及信息进行审查、监督及处理，包括但不限于用户信息（账号信息、个人信息等）、发布内容（位置、文字、图片、音频、视频、商标、专利、出版物等）、用户行为（构建关系、评论、私信、参与话题、参与活动、营销信息发布、举报投诉等）等范畴。我们发现、或收到第三方举报或投诉用户在使用
					爱驰销售助手APP 社区时违反本条规范，或发现任何形式侵犯爱驰权益、作出任何不利于爱驰的行为、任何影响 爱驰销售助手APP 论坛正常运营和/或有害 爱驰销售助手APP
					论坛生态的行为，我们有权依据合理判断要求用户：
				</PrivacyText>
				<PrivacyText>
					a. 限期改正;
					b.
					不经通知直接采取一切必要措施以减轻或消除用户不当行为造成的影响，并将尽可能在处理之后对用户进行通知。上述必要措施包括但不限于更改、屏蔽或删除相关内容，警告违规账号，限制或禁止违规账号部分或全部功能，暂停、终止、注销用户使用
					爱驰销售助手APP 和/或论坛功能的权利等。 </PrivacyText>

				<PrivacyText>
					以下是在 爱驰销售助手APP 的社区不被欢迎的行为：
				</PrivacyText>
				<PrivacyText>
					2.1不得违反中华人民共和国法律法规及相关国际条约或规则；
				</PrivacyText>
				<PrivacyText>
					2.2不得发布损害国家利益，危害国家稳定和民族团结的内容；
				</PrivacyText>
				<PrivacyText>
					2.3不得发布违反公序良俗，传播淫秽、色情、赌博、暴力、血腥、恐怖、密集或教唆犯罪的内容；
				</PrivacyText>
				<PrivacyText>
					2.4不得以任何方式侵犯其他任何人依法享有的专利权、著作权、商标权等知识产权，或姓名权、名称权、名誉权、荣誉权、肖像权、隐私权等人身权益，或其他任何合法权益；
				</PrivacyText>
				<PrivacyText>
					2.5不得散布谣言，发表未经证实且具有误导性的言论、诽谤他人及使用不文明用语
				</PrivacyText>
				<PrivacyText>
					2.6不得发布与爱驰无关的其他品牌的内容
				</PrivacyText>
				<PrivacyText>
					2.7不得发布图文不符的内容
				</PrivacyText>
				<PrivacyText>
					2.8不得频繁发布重复内容和发表重复且无意义的评论
				</PrivacyText>
				<PrivacyText>
					2.9不得发布募捐筹款等相关内容
				</PrivacyText>
				<PrivacyText>
					2.10不得发布与时政相关的内容
				</PrivacyText>


				<PrivacyPart>3. 许可授权</PrivacyPart>
				<PrivacyText>
					用户知悉、理解并同意授权爱驰非独家、可转授权地使用用户通过 爱驰销售助手APP 社区发布的内容，前述内容包括但不限于文字、图片、视频等。具体来说，可能会包括：
				</PrivacyText>
				<PrivacyText>3.1
					将前述内容通过爱驰自身或其他第三方技术、网络等在爱驰选择的网络平台、应用程序或产品中，以有线或无线网，通过免费或收费的方式在不同终端（包括但不限于电脑、手机、互联网电视、机顶盒及其他上网设备等）以不同形式（包括但不限于点播、直播、下载等）进行网络传播或电信增值服务等；

				</PrivacyText>
				<PrivacyText>3.2 将前述内容复制、翻译、编入爱驰当前已知或以后开发的作品、媒体或技术中，用于爱驰品牌或产品推广宣传等；

				</PrivacyText>
				<PrivacyText>3.3 将前述内容授权给电台、电视台、网络、纸质媒体、运营商平台等我们的第三方供应商，用于爱驰品牌或产品相关推广宣传等；

				</PrivacyText>
				<PrivacyText>3.4 其他出于善意或另行取得您授权的使用行为；
				</PrivacyText>
				<PrivacyText>
					您对爱驰的授权并不改变用户发布内容的所有权及知识产权归属，也并不影响您行使对发布内容的合法权利。爱驰将尽最大的商业努力合理使用用户的授权内容，但并不代表我们一定会使用。
				</PrivacyText>
				<PrivacyText>
					希望小伙伴们严格遵守 爱驰销售助手APP 的社区规范， 良好的社区环境需要你我共同守护。 如您在使用 爱驰销售助手APP 论坛的过程中，遇到其它用户上传违法侵权或违规内容，或是对社区规范有任何意见或建议，可通过以下方式联系我我们：400-820-2555				</PrivacyText>
			</View>
		);
	}
}
