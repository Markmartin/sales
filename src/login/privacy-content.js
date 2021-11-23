import React, {Component} from 'react';
import {View, ScrollView, Text} from 'react-native';
import {colors, size} from "../style/variables";
import {PrivacyTitle, PrivacyPart,PrivacyText} from './style'

export default class PrivacyContent extends Component {

	render() {
		return (
			<View style={{flex: 1, backgroundColor: colors.white,paddingTop:10}}>
				<PrivacyTitle>隐私政策</PrivacyTitle>
				<PrivacyPart>引言</PrivacyPart>
				<PrivacyText>
					欢迎您使用【 爱驰销售助手APP 】。爱驰汽车有限公司及其关联公司（以下部分条款亦称为“我们”）非常重视用户的隐私，并致力于用户信息保护。您在使用我们通过【 爱驰销售助手APP
					】提供的产品及服务时，我们可能会收集和使用您的相关信息。
					本隐私政策与您所使用的产品及服务息息相关，我们主要向您说明：
				</PrivacyText>
				<PrivacyText>
					我们收集的信息；
					信息使用的方式和范围；
					Cookie及相关技术的使用；
					信息的分享；
					信息的转移；
					信息的存储；
					对您的信息的管理；
					信息安全；
					未成年人保护；
					知识产权；
					遵守法律法规；
					隐私政策更新。
					希望您在使用前仔细阅读并确认您已经充分理解本隐私政策所写明的内容，您可以按照本隐私政策的指引做出您认为适当的选择。若您选择注册，您须点击“同意”；
				</PrivacyText>
				<PrivacyText>
					若本隐私政策后续有更新内容，仍需您阅读完整内容并充分理解之后，点击“同意”，才能继续使用我们的产品及服务。
				</PrivacyText>


				<PrivacyPart>我们收集的信息</PrivacyPart>
				<PrivacyText>
					在您使用我们的产品及服务过程中，我们可能收集、使用的您的信息主要包括：
				</PrivacyText>
				<PrivacyText>
					（一）您主动提供的信息
				</PrivacyText>
				<PrivacyText>
					您在使用我们的产品及服务时的个人信息，例如您的姓名（企业注册则需提供企业名称）、头像、昵称、性别、地区、联系电话、通讯地址、身份信息（企业注册则需提供企业代码）、驾照信息、紧急联络人、您的银行账户信息（包括但不限于开户行、支行、账户名称、银行帐号）、驾驶证证件信息、保险保单信息、行驶证信息等；
				</PrivacyText>
				<PrivacyText>
					您在使用我们的产品及服务中产生的信息，例如您的订单信息、您的账户状态、联系我们的客户服务或销售人员过程中产生信息和记录等；
				</PrivacyText>
				<PrivacyText>
					您参加我们举办活动时提交的信息，例如您的姓名、家庭住址等；
				</PrivacyText>
				<PrivacyText>
					其他信息，例如您明确声称归您所有的车辆的基本信息，包括但不限于车辆牌照信息、上牌城市信息等。
				</PrivacyText>
				<PrivacyText>
					我们的部分服务可能需要您提供完整的个人信息来实现特定功能，如您选择不提供该等信息，可能无法正常使用某些特定功能。如您主动提供个人信息，即意味着您同意我们按本隐私政策所述来收集、存储、使用处理您的个人信息。

					尽管如此，您仍可以在未注册方式下浏览【 爱驰销售助手APP 】的某些内容。
				</PrivacyText>

				<PrivacyPart>我们可能获取的信息</PrivacyPart>
				<PrivacyText>
					无论您是否注册，在您使用我们的产品及服务过程中，我们可能通过Cookie等技术收集：
				</PrivacyText>
				<PrivacyText>
					日志信息，例如您的操作记录、浏览记录、分享记录、服务故障信息、引荐网址等信息；
				</PrivacyText>
				<PrivacyText>
					设备信息，例如您的移动设备或用于接入我们服务的其他程序所提供的配置信息、移动设备所用的版本和设备识别码；
					此外，如您在安装时选择同意授权的，我们会采集您的信息访问网络的信息、通讯录信息、蓝牙连接信息、您的声音信息、影像信息、相册信息、短信验证码、请求安装apk等信息，以增加或提升服务功能。
				</PrivacyText>
				<PrivacyText>
					位置信息，例如您的IP地址、地理位置信息、网络状态等信息。
					在您使用我们的产品及服务中，为了提前发现问题，优化产品及提高服务质量，我们可能会收集并记录：

					为保障您使用我们的产品及服务时的安全性，更准确地预防网络欺诈和保护账户安全，我们可能会通过您的浏览信息、订单信息、软件信息、设备信息等判断您的账号风险，并可能会记录一些我们认为有风险的链接；
					您购买的车辆或其他产品的性能、状态、车辆控制器状态信息、车辆位置信息、您操作车辆的信息、以及其他有关车辆或产品安全性能的信息或者路况信息；
					您购买的车辆或其他产品的保养或者故障维修时的信息，为车辆事故定损需要，我们可能会收集、查看相关影像资料；
					您购买的车辆或其他产品维修保养时的信息，例如您的车辆电池状况、充换电服务使用状况、维修记录等。
					同时，我们将根据最新适用的法律法规或有权部门要求而需要获取/监控车辆或其他产品的其他数据信息。
				</PrivacyText>


				<PrivacyPart>从第三方获取的信息</PrivacyPart>
				<PrivacyText>
					我们可能会获取您在使用第三方平台时所产生或分享的信息。例如，您通过微信或QQ等第三方平台注册或登录，我们会获取第三方平台中您的头像、昵称、联系方式、登录时间及其他配置等信息。如您不希望给予我们访问第三方平台账号的权限或信息，请您通过我们的【 爱驰销售助手APP 】直接注册登录。本隐私政策不涉及任何第三方对您的信息收集、使用或分享行为，关于您在第三方平台中所有的信息和隐私保护，请您参阅第三方平台的隐私政策。
				</PrivacyText>


				<PrivacyPart>信息使用的方式和范围</PrivacyPart>
				<PrivacyText>
					我们遵守法律法规及与您的约定，在您使用我们的产品及服务的过程中所收集的信息可能用途，包括但不限于：向您提供服务（包括但不限于【 爱驰销售助手APP 】内的各项功能服务以及我们向您提供的各项线下服务），回复您的咨询和要求，向您发送产品、功能等信息；完成您的购买行为与订单流程；以及
				</PrivacyText>
				<PrivacyText>
					（一）产品开发与服务优化

					进行服务回访，获得您的反馈；
					邀请您参与我们产品和服务的调查或会员活动；
					了解您如何使用我们的服务，回应和满足您的个性化需求；
					分析故障，开发新产品及服务，扩大我们的业务运营。				</PrivacyText>
				<PrivacyText>
					（二）向您推荐您可能感兴趣的广告、资讯，了解您的兴趣，并改善我们投放的广告及其他推广活动的效果；
				</PrivacyText>
				<PrivacyText>
					（三）用于法律法规或有权部门要求或监管需要的其他用途。
				</PrivacyText>
				<PrivacyText>
					在符合相关法律法规并征得您同意的前提下，我们可能将通过服务所收集的信息用于我们的其他业务服务，以改善您的体验和提高我们的服务质量。例如，将您在使用我们的产品及服务时的信息用于用户研究分析与统计等服务。				</PrivacyText>
				<PrivacyText>
					为了为您提供安全的服务，帮助我们更好地了解应用程序的运行情况，我们可能记录相关信息，例如，您使用应用程序的频率、故障信息、性能数据以及应用程序的来源。

					我们将视具体情况，可能会对您的信息进行匿名化处理。我们将在法律及经您同意的本隐私政策规定的范围内使用或分享您的信息。
				</PrivacyText>

				<PrivacyPart>Cookie及相关技术的使用</PrivacyPart>
				<PrivacyText>
					Cookie是一种可让网站服务器将数据存储于客户端或从客户端中读取数据的技术，Cookie文件是存储了一些与用户访问网站有关信息的文件。

					我们可能通过Cookie等相关技术自动收集您的信息，目的是为您提供更个性化的用户体验和服务。您也可以通过浏览器设置管理Cookie。但请注意，如果停用Cookie，您可能无法享受最佳的服务体验，某些服务也可能无法正常使用。
				</PrivacyText>


				<PrivacyPart>信息的分享</PrivacyPart>
				<PrivacyText>
					您的分享

					您可以通过我们的【 爱驰销售助手APP 】与其他用户主动分享您的相关信息。请注意，这其中可能包含您的身份信息、财产信息等敏感信息，请谨慎考虑披露和分享您的敏感信息。您的敏感信息是指非法泄露或滥用可能为您的人身和财产安全带来负面影响的个人信息。

					您可通过我们服务中的设置来控制您分享信息的范围，也可通过服务中的设置或我们提供的指引删除您公开分享的信息。请您注意，您分享的信息可能被其他用户或不受我们控制的非关联第三方进行保存或分享。				</PrivacyText>

				<PrivacyText>
					我们的分享

					我们将遵照法律法规，对信息的分享进行严格限制，为向您提供产品及服务以及本隐私政策“信息使用的方式和范围”所述之目的，或符合社会公共利益和公共安全维护、他人生命财产安全保护需要，或有权部门的要求，我们可能将您的信息分享给：

					我们控制或拥有重大权益的关联方；
					我们的第三方服务供应商或合作伙伴，用以支持本隐私政策所述之目的以及改善为您提供的服务，该等支持包括为我们的订单履行提供基础技术服务、物流配送服务、支付服务、数据处理等，我们会与其签署严格的保密协定，要求他们按照我们的要求、本隐私政策以及其他任何相关的保密和安全措施来处理您的信息；
					基于法律法规、法院裁判、其他法律程序或有权部门的要求向法院或政府机关提供您的信息；
					在法律法规要求或允许的范围内，为保护我们及我们的员工、用户或公众的权利、财产或安全免遭损害而分享您的信息；
					根据您的授权分享给您选择的第三方服务供应商、您参与的活动第三方提供者以及您授权的社交媒体等。
				</PrivacyText>

				<PrivacyPart>信息的转移</PrivacyPart>
				<PrivacyText>
					除非符合下列情况，我们不会将您的信息转移给任何非关联第三方：
				</PrivacyText>
				<PrivacyText>
					事先获取您的同意或授权；
					符合与您的约定（包括在线签署的电子协议以及相应的平台规则）所提供；
					发生业务并购、重组或出售时，作为业务内容的一部分；
					基于法律法规、法院裁判、其他法律程序或有权部门的要求进行转移。
					在上述转移发生前，我们会以适当方式给予您通知，并确保您的信息在转移后得到与本隐私政策相当的保护。
				</PrivacyText>

				<PrivacyPart>信息的存储</PrivacyPart>
				<PrivacyText>
					我们非常重视个人信息安全，并采取一切合理可行的措施来保护您的信息。您的信息将被存储于中华人民共和国境内。如您使用跨境交易服务，且需要向境外传输您的个人信息完成交易的，我们会根据法律法规的规定征得您的同意，据此可能将您的信息传输至境外有关主体。

					我们仅在达成本隐私政策所述目的所需的期限内保留您的个人信息，超出上述期限后，我们将对您的信息进行删除或进行匿名处理，但是我们有可能因法律要求，更改信息的存储时间。
				</PrivacyText>


				<PrivacyPart>对您的信息管理</PrivacyPart>
				<PrivacyText>
					根据适用的法律法规，我们将采取适当的技术手段，保证您访问、更新、更正或删除您的个人信息的权利。在您行使您的权利时，我们可以要求您提供身份证明，以确保我们保护客户的机密信息。

					如果您想访问您的【 爱驰销售助手 APP 】账户信息、订单信息、车辆使用数据等信息，您可通过【 爱驰销售助手 APP 】中的 我的 \ 21 好想法 功能 提交相关要求以访问您的个人信息。基于某些例外，我们可能会在适用法律及法规允许的范围内拒绝您的请求。我们保留根据适用法律及法规调整您上述权利的权利。

					当您发现我们处理的关于您的个人信息有错误时，经对您的身份进行验证，且更正不影响信息的客观性和准确性的情况下，您有权对错误或不完整的信息作出更正或更新。对于【 爱驰销售助手 APP 】不支持线上更正或更新的个人信息，您可通过【 爱驰销售助手 APP 】中的 我 的 \ 2 1 好 想法 功能 提交相关要求。

					如果我们违反法律法规或与您的约定收集、使用、向他人分享您的个人信息，您有权要求我们进行删除。您可通过【 爱驰销售助手 APP 】中的 我 的 \ 2 1 好 想法 功能 提交相关要求。
				</PrivacyText>


				<PrivacyPart>信息安全</PrivacyPart>
				<PrivacyText>
					我们严格遵守法律法规保护您的信息。我们将在合理义务内采取各种安全保护措施以保障您的信息安全，我们也将通过专门管理制度、组织和流程，努力保护您的信息安全。

					我们会制定信息安全事件应急预案，及时处置系统漏洞、计算机病毒、网络攻击、网络侵入等安全风险，并按照法律法规的要求向有关主管部门报告。在发生安全事件后，我们将及时以系统通知、短信通知、电话、邮件等您预留的任一或全部联系方式告知您。
				</PrivacyText>

				<PrivacyPart>未成年人保护</PrivacyPart>
				<PrivacyText>
					我们非常重视对未成年人个人信息的保护。若您是18周岁以下的未成年人，在使用我们的产品及服务前，应事先取得您的监护人的同意。我们只会在法律法规允许或法定监护人明确同意或者保护未成年人需要的情况下收集、使用或披露信息。
				</PrivacyText>

				<PrivacyPart>知识产权</PrivacyPart>
				<PrivacyText>
					除非另有说明，我们所发布的所有照片、图像、图表、链接、系统结构、格式、布局和数据以及所有其它内容为我们所有的财产或我们经授权而使用，均受法律保护，您仅可以出于个人使用之目的浏览，非经爱驰汽车有限公司事先书面许可不得以任何方式使用，但本隐私政策或【 爱驰销售助手APP 】内另有规定的除外，未经授权使用该等材料可能违反著作权法、商标法和/或隐私方面的法律法规。

					您在使用【 爱驰销售助手APP 】的过程中所发布的文章、评论或其他内容应不侵犯第三方的权利，如知识产权、名誉权等。您同意授权我们免费使用您发布的内容，包括但不限于展示、编辑等。
				</PrivacyText>


				<PrivacyPart>遵守法律法规</PrivacyPart>
				<PrivacyText>
					您在使用【 爱驰销售助手APP 】的过程中，应该遵守中华人民共和国的法律法规；您同意我们可以采取任何必要的措施处理不合法、不文明的信息或内容。
				</PrivacyText>

				<PrivacyPart>隐私政策更新</PrivacyPart>
				<PrivacyText>
					我们在更新本隐私政策前，将以页面通知的方式告知您，以便使您了解更新信息。我们建议您阅读完整内容并充分理解本隐私政策，您点击“同意”，才能继续使用我们的产品及服务。
				</PrivacyText>

			</View>
		);
	}
}
