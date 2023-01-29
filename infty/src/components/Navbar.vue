<template>
    <div>
        <header>
            <div class="logo">
                <router-link to="/">
                    <img class="logo-img" src="@/assets/imgs/infty-logo.png" alt="logo" />
                </router-link>
            </div>
            <nav>
                <ul class="nav__links">
                    <li v-bind:class="{ active: activeIndex == 0 }">
                        <router-link to="/marketplace">{{ $t("marketplace") }}</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 2 }">
                        <router-link to="/mine/create">{{ $t("create") }}</router-link>
                    </li>
                    <li v-bind:class="{ active: activeIndex == 3 }">
                        <router-link to="/mine/collections">{{ $t("collections") }}</router-link>
                    </li>
                    <li v-if="$store.getters.getLogInStatus">
                        <img :src="profilePicture" class="profile-pic" @click="toProfile" />
                    </li>
                    <li v-else>
                        <b-button pill variant="primary" class="wallet-btn" @click="connectWallet">
                            <b-icon class="ml-2 mr-2" icon="wallet2" aria-hidden="true"></b-icon>
                        </b-button>
                    </li>
                </ul>
            </nav>
        </header>
        <b-modal ref="reg-modal" title="Register" @ok="handleRegister">
            <div class="mb-4">
                {{ $t("notice") }}
            </div>
            <label>{{ $t("firstName") }}</label>
            <b-form-input class="mb-4" v-model="firstName" placeholder="Your creative first name here..." />
            <label>{{ $t("lastName") }}</label>
            <b-form-input class="mb-4" v-model="lastName" placeholder="Optional" />
            <label>{{ $t("terms") }}</label>
            <div class="scrollable-div">
               <div class="scrollable-div-text" v-if="$i18n.locale == 'cn'">
                <p>尊敬的用户（&ldquo;您&rdquo;）：</p>
                <p>欢迎您使用Infty市场（包括Infty市场官方网站http://infty.market，以下简称&ldquo;本平台&rdquo;），本平台由多伦多大学应用开发社（以下简称&ldquo;我们&rdquo;）运营。本平台是一款为用户提供购买、收集和展示区块链数字收藏品（登记在区块链上，由各领域的顶尖艺术家创作、限量发行的数字艺术收藏品。以下简称&ldquo;数字收藏品&rdquo;）的平台。使用我们的服务前请您仔细阅读以下条款，使用我们的服务则表明您已知悉并接受这些条款（以下简称&ldquo;本协议&rdquo;）。若您不接受有关条款和条件的约束，请立即停止使用我们的服务。</p>
                <p>任何未满18周岁的未成年人或不具备完全民事行为能力之人均不得注册账号或使用我们提供的服务。</p>
                <p>&nbsp;</p>
                <p>一、签约主体以及协议范围</p>
                <p>1.1协议主体及范围</p>
                <p>本协议是您与我们就使用本平台服务而共同订立的协议。</p>
                <p>本协议条款的效力及于我们所提供的一切产品和服务，您在享受本平台任何服务时，应当受本协议的约束。本协议项下的产品和服务是指由我们发布的包括但不限于网络媒体、互联网增值、互动娱乐、电子商务、广告等互联网产品和服务（形式包括但不限于视频、音频、评论、跟帖、弹幕、图片、软件、技术代码等）。</p>
                <p>1.2订立前提</p>
                <p>数字收藏品是数字化的收藏品，您在此承诺并保证，您主要将本平台上的数字收藏品用作收藏、娱乐和游戏的对象，而不是用于投资、投机或炒作；您在此承诺并保证，您将主要将实物收藏品的区块链数字证书作为防伪溯源的工具，而不是用于投资、投机或炒作，该等承诺与保证将作为您与我们订立本协议的前提。</p>
                <p>1.3免责条款</p>
                <p>为了让您更好地使用我们提供的产品和服务，请您务必审慎阅读、充分理解本协议各条款内容，特别是免除或者限制责任的条款。本协议中限制、免责条款可能以加粗形式提醒您注意。</p>
                <p>当您注册/登录本平台，即视为您已充分阅读并接受本协议的所有条款，您同意本协议对您与我们双方具有法律约束力。</p>
                <p>1.4协议组成部分</p>
                <p>除本协议明确规定外，对于我们发布的由著作权人或其他权利人销售的产品和服务，我们有权在本协议的基础上通过单独的产品和服务协议（以下简称&ldquo;单项产品协议&rdquo;）加以规范，您须在使用有关产品或服务时另行了解与确认。单项产品协议与本协议有冲突的地方，以单项产品协议为准。如您使用该产品或服务，即视为对相关单项产品协议的接受。</p>
                <p>本协议内容同时包括所有我们已经发布或未来可能发布的各类规则、公告或通知，以及您在使用某一特定产品或服务时同意的单项产品协议，前述规则、公告、通知和单项产品协议一经发布即为本协议不可分割的组成部分，对您和我们双方具有法律约束力。</p>
                <p>1.5协议的修订</p>
                <p>我们有权根据需要不时地修订本协议及/或各类规则（包括但不限于制定新的条款和修改既有条款），一旦发生变动，我们将尽可能及时地在平台上以在线公告的方式进行变更公告，而无须另行单独通知您。修订后的协议和规则一经公布，立即或在公告明确的特定时间生效。若您在前述公告修订后继续使用我们的产品或服务，即视为您已阅读、理解并接受经过修订的协议和规则。若您不同意修订，应当立即停止使用本平台。</p>
                <p>&nbsp;</p>
                <p>二、账号的注册、使用与安全</p>
                <p>2.1注册资格</p>
                <p>您确认，您应当年满18周岁并具备完全民事行为能力，方可注册使用本平台。如果您不满18周岁或不具有完全民事行为能力，您不应使用本平台，否则您及您的法定监护人应依照法律规定承担因此而导致的一切后果。</p>
                <p>2.2账号注册</p>
                <p>您在注册时应当使用Conflux以完成注册。当您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，您可使用我们向您提供的账号并成为我们的用户。您的账号是您用以登录并使用我们服务、购买数字收藏品的凭证。但请您特别注意，我们仅许可您出于个人而非商业目的使用该账号。我们保留该账号以及与注册、使用该账号相关的服务数据和记录的所有权，包括但不限于所有注册、登录、服务日志、客服记录和相关使用数据等。</p>
                <p>2.3账号信息</p>
                <p>您应当按照法律法规要求或按相应页面的提示，准确提供并及时更新您的账号信息，以使之真实、及时、完整和准确，您须对所提供信息的真实性、合法性、有效性及完整性负责。如您提供的资料错误、不实、过时或不完整的，我们可以向您发出询问及/或要求改正的通知，您应按照我们的要求配合提供或者更新相关信息和资料。因您填写的信息、资料不真实、不及时、不完整或不准确的，您应承担您不能使用我们的账号（不能注册成功、或账号被冻结、注销）或在使用过程中部分功能受到限制的后果和损失。</p>
                <p>2.4昵称</p>
                <p>您可以对账号设置昵称，您设置的昵称不得侵犯或涉嫌侵犯他人的合法权益。设置昵称时遵守以下规定：</p>
                <p>（1）不以党和国家领导人或其他社会名人的真实姓名、字号、艺名、笔名注册；</p>
                <p>（2）不以国家机构或其他机构的名称注册；</p>
                <p>（3）不注册名称不文明、不健康的账号，或包含歧视、侮辱、猥亵类词语的账号；</p>
                <p>（4）不注册易产生歧义、引起他人误解的账号；</p>
                <p>（5）不得危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一；</p>
                <p>（6）不得损害国家荣誉和利益的，损害公共利益；</p>
                <p>（7）不得煽动民族仇恨、民族歧视，破坏民族团结；</p>
                <p>（8）不得破坏国家宗教政策，宣扬邪教和封建迷信；</p>
                <p>（9）不得散布谣言，扰乱社会秩序，破坏社会稳定；</p>
                <p>（10）不得散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪；</p>
                <p>（11）不得侮辱或者诽谤他人，侵害他人合法权益；</p>
                <p>（12）不得违反宪法或法律法规规定；</p>
                <p>（13）不得含有法律、行政法规禁止的其他内容。</p>
                <p>如您设置的昵称涉嫌侵犯他人合法权益或者含有法律、行政法规禁止的其他内容，我们有权拒绝或终止向您提供部分或全部软件服务。我们对此不承担任何责任，您将承担因此产生的任何直接或间接损失及不利后果。</p>
                <p>2.5禁止外借</p>
                <p>您的账号仅限于您本人使用，未经我们书面同意，禁止以任何形式赠与、借用、出租、转让、售卖或以其他方式许可他人使用该账号。如果我们发现或者有合理理由认为使用者并非账号初始注册人，我们有权暂时或终止向该注册账号提供服务，并有权注销该账号，而无需向注册该账号的用户承担法律责任。</p>
                <p>2.6禁止恶意注册</p>
                <p>禁止恶意注册账号，包括但不限于频繁、批量注册账号。如果我们发现或者有合理理由认为您有恶意注册账号的行为，我们有权拒绝您的恶意注册，或注销恶意注册的账号。</p>
                <p>2.7账号保管</p>
                <p>您须妥善保管您的账号，在任何情况下不向他人透露账号。您需确保您在购买数字收藏品和使用我们的服务后，以正确步骤离开本平台。您对以您注册账号的名义所从事的活动承担全部法律责任，包括但不限于在本平台购买数字收藏品、支付款项、信息披露、信息发布、网上点击同意或提交各类规则协议等操作行为可能引起的一切法律后果。&nbsp; 因您的行为或因其他因素致您账号遭受攻击、诈骗、盗窃等导致的账号泄露的损失及后果，我们不承担任何责任。&nbsp; 如发现他人未经授权使用您的账号，您应立即通知我们，我们将协助您冻结账号或进行其他安全设置。&nbsp; 请您理解我们对您的请求采取行动需要合理时间，我们对在采取行动前已经产生的以及由您引发的后果（包括但不限于您的任何损失）不承担任何责任。</p>
                <p>2.8实名认证</p>
                <p>为了您更好地使用我们的各项服务，保障您的账号安全，我们可能要求您按相关法律法规规定完成实名认证及/或对您进行&ldquo;了解你的客户&rdquo;调查，并要求您进一步提供相关资料。</p>
                <p>2.9账号的冻结及申诉</p>
                <p>如发生以下情况，我们有权冻结您的账号（全部或部分权限或功能），并通过适当的方式和途径通知您：</p>
                <p>（1）违反本协议，以及数字收藏品购买、展示和服务的相关规则、管理规范、服务说明以及其他使用协议/条款的；</p>
                <p>（2）违反国家法律、法规、政策、法律文书的规定的；</p>
                <p>（3）您遭到他人投诉，且对方已经提供了相关证据，而您未按照我们的要求提供相反证据的；</p>
                <p>（4）我们根据合理分析判断您的账号操作存在异常、进行可疑交易或存在欺诈、洗钱的风险；</p>
                <p>（5）为了保护我们及其他用户的合法权益；</p>
                <p>（6）国家有权机关要求。</p>
                <p>若您的账号被冻结，在解冻前您将暂时无法使用账号购买数字收藏品。我们有权不经通知随时删除相关违规内容，并视行为情节对违规账号进行处理，处理方式包括但不限于警告、删除部分或全部订阅用户、限制或禁止使用全部或部分功能、账号封禁甚至注销，并有权视具体情况而公告处理结果。</p>
                <p>您可以通过申诉程序，向我们申请解除上述冻结。为了您的账号安全，您应配合如实提供身份证明及相关资料，以及我们要求的其他信息或文件，以便我们进行核实和调查。我们有权决定是否同意您的申诉请求。</p>
                <p>&nbsp;</p>
                <p>三、账号的注销</p>
                <p>您有权主动注销您的账号，您可以通过本平台&ldquo;关于我们&rdquo;页面提供的联系方式联系我们注销您的账号（但法律法规另有规定的或本政策另有约定的除外）。&nbsp; 一旦您注销账号，将无法登录原账号使用我们提供的产品和服务且自动放弃您已有的权益，因此请您谨慎操作。&nbsp; 在您的账号被您主动注销或由于违反上述第二条的约定被强制注销后，将可能产生包括但不限于如下结果需要您自行承担：</p>
                <p>3.1账号一旦注销，您将无法登录、使用该账号，即您将无法再以此账号登录、使用、继续使用本平台所有产品与服务；</p>
                <p>3.2账号一旦注销，您曾通过该账号登录、使用的本平台的产品与服务下的所有内容、信息、数据、记录及您已经购买的数字收藏品将会被全部冻结，包括但不限于：</p>
                <p>（1）该账号购买的数字收藏品或获得的实物收藏品的数字证书；</p>
                <p>（2）该账号下的个人资料（例如：头像、昵称等）及绑定信息（例如：绑定手机号、邮箱等），以及该账号下的您的其他个人信息。同时您亦不再享有《薄盒隐私政策》中约定的您对个人信息的权利，但法律法规另有约定的除外；</p>
                <p>（3）该账号曾发表的所有内容（例如：文章、图片、评论、互动等）；</p>
                <p>（4）其他与该账号相关的所有内容、信息、数据、记录（例如：收藏等）。</p>
                <p>3.3您同意通过注销账号的方式放弃该账号在使用本平台产品与服务期间已产生的但未消耗完毕的权益及未来的预期利益。即账号一旦注销，您在该账号下的全部权益将会自动清除作废，包括但不限于：</p>
                <p>（1）您尚未提现的账户余额；</p>
                <p>（2）您在本平台发布的内容未来的收益权益；</p>
                <p>（3）您在本平台的各类身份权益；</p>
                <p>（4）其他已产生但未消耗完毕的权益或未来预期的收益。</p>
                <p>3.4您的账号一旦注销，将无法恢复，即使您在注销后以相同手机号码再次向我们申请注册本平台账号，此时该账号将为全新的用户账号。因此，我们善意地提醒您在主动申请注销前对需要备份的内容提前自行做好备份，对需要提现的余额先行提现，对其他利益做出妥善安排，谨慎思考后做出注销决定；</p>
                <p>3.5账号一旦注销，您与我们曾签署过的协议、文件等相应终止（但已约定继续生效的或法律法规另有规定的除外）；</p>
                <p>3.6其他因账号注销（可能）产生的结果。</p>
                <p>&nbsp;</p>
                <p>四、我们的服务</p>
                <p>4.1数字收藏品浏览、关注、分享、展示</p>
                <p>在您浏览本平台过程中，我们为您提供了信息分类、关键词检索、筛选、关注、展示等功能，以更好地匹配您的需求。您可以对您感兴趣的数字收藏品进行浏览、关注、分享，并向他人展示您购买到的数字收藏品。</p>
                <p>4.2广告营销</p>
                <p>您在本平台提交信息（包括但不限于邮箱、电话、姓名等），即视为您同意我们自行或者委托第三方广告商通过电子邮件、站内信、手机短信、电话等形式与您联系，向您发送简报、广告等商业推送。</p>
                <p>您可以按照商业广告信息中说明的退订方式退订广告，也可以通过本平台&ldquo;关于我们&rdquo;页面提供的联系方式联系我们取消广告推送，但是不得采用未经我们许可的方式屏蔽、过滤广告信息。</p>
                <p>4.3争议处理</p>
                <p>对于您通过平台购买的实物产品，其本身存在质量问题或其他争议的，您可以向平台反应，由平台向您提供销售方的联系方式，由您向销售方维权。 对于您通过平台购买的数字收藏品，或如果在使用我们的服务过程中发生争议，您可以联系我们进行调解、协商和解决。您也可以向有关行政部门投诉或向本协议约定的管辖法院提起诉讼。</p>
                <p>4.4服务升级</p>
                <p>为增进用户体验、完善服务内容，我们将会改进、增强和进一步开发本平台的服务，您理解并同意，我们有权不向您特别通知而对本平台服务进行更新，或对本平台的部分功能进行改变或限制。</p>
                <p>4.5 对于您根据本协议、通过本平台购买的商品（包括数字收藏品），您将有权利要求取得等额于您实际支付的全部价款的增值税发票，并通过平台发起开票请求。平台将把您的开票请求反馈至实际销售方。您认可并同意该发票将由实际的销售方负责开具。</p>
                <p>&nbsp;</p>
                <p>五、使用规范</p>
                <p>您有权享受本平台提供的互联网技术服务和信息服务，通过本平台购买和展示数字收藏品，或获得实物收藏品的区块链数字证书。在您遵守本协议的前提下，我们授予您关于本平台有限的、不可转让的、非独占的、可撤销的、仅为个人用途的非商业性使用的权利。在任何情形下，我们的内容及服务仅被许可由您个人使用而不得被出售或转让。我们保留本协议未特别授予的所有权利。您在使用我们的服务过程中，必须遵循以下原则：</p>
                <p>5.1您不得制作、复制、发布、传播含有下列内容的信息或从事相关行为，也不得为制作、复制、发布、传播含有下列内容的信息或从事相关行为提供便利。本条所述内容是指您使用本协议项下服务过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、昵称、评价等信息，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用账号或本平台服务所产生的内容。</p>
                <p>（1）反对宪法所确定的基本原则的；</p>
                <p>（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
                <p>（3）损害国家荣誉和利益的；</p>
                <p>（4）歪曲、丑化、亵渎、否定英雄烈士事迹和精神，以侮辱、诽谤或者其他方式侵害英雄烈士的姓名、肖像、名誉、荣誉的；</p>
                <p>（5）宣扬恐怖主义、极端主义或者煽动实施恐怖活动、极端主义活动的；</p>
                <p>（6）煽动民族仇恨、民族歧视，破坏民族团结的；</p>
                <p>（7）破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
                <p>（8）散布谣言，扰乱经济秩序和社会秩序的；</p>
                <p>（9）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
                <p>（10）侮辱或者诽谤他人，侵害他人名誉、隐私和其他合法权益的；</p>
                <p>（11）违反法律法规底线、社会主义制度底线、国家利益底线、公民合法权益底线、社会公共秩序底线、道德风尚底线和信息真实性底线的&ldquo;七条底线&rdquo;要求的。</p>
                <p>同时，您应当防范和抵制制作、复制、发布含有下列内容的不良信息：</p>
                <p>（1）使用夸张标题，内容与标题严重不符的；</p>
                <p>（2）炒作绯闻、丑闻、劣迹等的；</p>
                <p>（3）不当评述自然灾害、重大事故等灾难的；</p>
                <p>（4）有性暗示、性挑逗等易使人产生性联想的；</p>
                <p>（5）展现血腥、惊悚、残忍等致人身心不适的；</p>
                <p>（6）煽动人群歧视、地域歧视等的；</p>
                <p>（7）宣扬低俗、庸俗、媚俗内容的；</p>
                <p>（8）可能引发未成年人模仿不安全行为和违反社会公德行为、诱导未成年人不良嗜好等的；</p>
                <p>（9）其他对网络生态造成不良影响的内容。</p>
                <p>5.2不得利用我们的服务从事违法犯罪的活动，包括分裂国家、教唆他人犯罪、侵犯计算机安全系统、干扰或扰乱网络服务等危害国家安全、欺诈、洗钱及从事或资助其他违法犯罪活动或有损社会公共利益的行为。</p>
                <p>5.3遵守本协议及所有相关的协议、规定和程序，同时也必须遵循与因特网有关的程序和惯例。</p>
                <p>5.4不得利用或针对我们的服务进行任何危害计算机网络安全的行为，包括但不限于：</p>
                <p>（1）非法侵入他人网络、干扰他人网络正常功能、窃取网络数据等危害网络安全的活动；</p>
                <p>（2）提供专门用于从事侵入网络、干扰网络正常功能及防护措施、窃取网络数据等危害网络安全活动的程序、工具；</p>
                <p>（3）明知他人从事危害网络安全的活动的，为其提供技术支持、广告推广、支付结算等帮助；</p>
                <p>（4）使用未经许可的数据或进入未经许可的服务器/账号；</p>
                <p>（5）未经允许进入公众计算机网络或者他人计算机系统并删除、修改、增加存储信息；</p>
                <p>（6）未经许可，企图探查、扫描、测试本服务系统或网络的弱点或其它实施破坏网络安全的行为；</p>
                <p>（7）企图干涉、破坏本服务系统或平台的正常运行，故意传播恶意程序或病毒以及其他破坏干扰正常网络信息服务的行为；</p>
                <p>（8）伪造TCP/IP数据包名称或部分名称。</p>
                <p>5.5不得对本平台进行反向工程、反向汇编、编译或者以其他方式尝试发现本平台的源代码。</p>
                <p>5.6不得提交、发布虚假信息；不得欺诈、强制、诱导其他用户关注、点击链接页面或分享信息；不得使用机器人或自动化程序，以虚假或欺诈的方式创建账号或购买数字收藏品；不得冒充他人，使用他人的电子邮件地址创建账号或购买数字收藏品。</p>
                <p>5.7不得使用未经我们授权或许可的任何插件、外挂、系统或第三方工具对本服务的正常运行进行干扰、破坏、修改或施加其他影响。</p>
                <p>5.8您应当使用自有合法资金购买数字收藏品。</p>
                <p>5.9不得通过非法方式购买数字收藏品，例如：盗刷信用卡或者使用其他您无权使用的支付方式或机制；不得通过非法方式获得实物收藏品的区块链数字证书，例如：盗窃他人所有或占有的实物收藏品，并基于该实物收藏品获得数字证书。</p>
                <p>5.10您的购买行为应当基于真实的消费、收藏需求，而非基于投资或投机目的，不得存在对数字收藏品实施恶意购买、价格操纵或利用数字收藏品进行洗钱等扰乱正常平台秩序的行为。基于维护平台秩序及平台安全的需要，我们发现上述情形时可主动执行关闭相关订单等操作。</p>
                <p>5.11不得将本平台的数字收藏品作为购买其他资产的一般等价物或凭证。</p>
                <p>5.12不得在本平台之外购买任何本平台的其它用户账号或本平台出售的数字收藏品。如果您以其他方式购买本平台出售的数字收藏品，产生的法律后果由您自行承担。</p>
                <p>5.13不得在本平台以外将数字收藏品拆分成份额进行交易，不得采取集中竞价、集合竞价、连续竞价、电子撮合、做市交易等方式交易数字收藏品。不得在本平台以外将实物收藏品的数字证书进行交易、炒作，不得采取集中竞价、集合竞价、连续竞价、电子撮合、做市交易等方式交易实物收藏品的数字证书。</p>
                <p>5.14请您保证对通过本平台制作、复制、上传、发布、传播、评论的任何内容（包括但不限于头像、名称、账号介绍，或文字、图片、音频、视频、链接等，以及其他使用本平台服务所产生的其他内容）享有合法权益，不得侵犯我们及我们关联公司、或其他任何第三方的专利权、著作权、商标权等知识产权、名誉权、隐私权或其他任何合法权益，或从事损害我们利益或对我们造成不利影响的行为。 若您账号中的内容发生权利纠纷或侵犯了任何第三方的合法权益，您需承担全部法律责任。</p>
                <p>5.15除非已遵守了本协议的其它规定或已取得了我们事先许可，您不得为任何目的从事或帮助他人从事以下行为：</p>
                <p>（1）下载、复制、读取、采用、展示、分享、转发、传播、上载、出版、发行我们的服务内容；</p>
                <p>（2）修改、编辑、整理、编排或以其他方式演绎我们的服务内容；</p>
                <p>（3）转让、转售、出租我们的服务内容；</p>
                <p>（4）采用包括但不限于特殊标识、特殊代码等任何形式的识别方法，自行或协助第三人对我们服务的信息内容产生流量、阅读量引导、转移、劫持等不利影响。</p>
                <p>5.16经我们书面事先许可后，您对我们相关服务的信息内容的分享、转发等行为，还应符合以下规范：</p>
                <p>（1）对抓取、统计、获得的相关搜索热词、命中率、分类、搜索量、点击率、阅读量等相关数据，未经我们事先书面同意，不得将上述数据以任何方式公示、提供、泄露给任何第三人；</p>
                <p>（2）不得对本平台的源网页进行任何形式的任何改动，包括但不限于本平台的首页链接、广告系统链接等入口，也不得对本平台的源页面的展示进行任何形式的遮挡、插入、弹窗等妨碍；</p>
                <p>（3）应当采取安全、有效、严密的措施，防止我们的信息内容被第三方通过包括但不限于网络爬虫程序等任何形式进行非法获取；</p>
                <p>（4）不得把相关数据内容用于我们书面许可范围之外的目的，进行任何形式的销售和商业使用，或向第三方泄露、提供或允许第三方为任何方式的使用；</p>
                <p>（5）用户向任何第三人分享、转发我们相关服务信息内容的行为，还应遵守我们为此制定的其他规范和标准。</p>
                <p>5.17为了保护数据安全，您不得从事包括但不限于以下行为，也不得为其提供便利：</p>
                <p>（1）未经其他用户明确同意，或在未向其他用户如实披露数据用途、使用范围等相关信息的情形下收集、复制、存储、使用或传输其他用户数据，侵害其他用户合法权益；</p>
                <p>（2）将其他用户的帐号、昵称等个人信息用于任何未经用户及我们授权的用途；</p>
                <p>（3）企图进行反射查找、跟踪、关联、挖掘、获取用户账号、手机号和出生日期等个人信息；</p>
                <p>（4）通过各种程序、软件等抓取任何用户的信息或与本服务相关的任何信息、数据；</p>
                <p>（5）未经我们授权使用任何第三方软件、插件、外挂、系统等查看、获取本服务中所包含的我们及我们合作伙伴或用户的任何相关信息、数据等内容；</p>
                <p>（6）其他危害数据安全的行为。</p>
                <p>5.18您在使用我们的服务时违反上述任何规定，我们可自行判断并处理，要求您改正或采取一切必要的措施（包括但不限于删除您上传的内容、暂停或终止您使用本平台、删除您的数字收藏品图像和描述、没收您购买获得的全部数字收藏品）以减轻您不当行为造成的影响，且在任何时候有权在不进行任何事先通知的情况下终止向您提供服务，并追究相关责任。&nbsp; 您违反上述任何规定产生任何法律后果的，应以您自己的名义独立承担所有的法律责任，造成我们损失或造成我们被第三人索赔的，您应全额赔偿我们的一切损失和费用（包括但不限于各种赔偿费、诉讼代理费及为此支出的其他合理费用）</p>
                <p>5.19若您发现本平台内用户发布的内容（包括但不限于图片、视频、文字作品等）侵犯您的在先权利，您可以通过contact@whileone.solutions联系我们进行举报，并提供相应的证明资料，我们核实后将及时采取措施制止侵权行为。</p>
                <p>&nbsp;</p>
                <p>六、数字收藏品的权利及限制</p>
                <p>6.1您可以通过本平台购买由各领域的顶尖创作家创作的，登记在区块链上，基于区块链技术的加密性、不可篡改性和不可替代性，将区块链登记作为其唯一的权属凭证的数字收藏品 按照本协议的约定获取、购买数字收藏品之后，您对数字收藏品拥有的权利将受到限制，您仅可以将该数字收藏品列入您的收藏欣赏、浏览及向其他用户展示您的数字收藏品。 数字收藏品元数据中的创作者、创作和上链时间、购买者等信息，一经确认则不可篡改，当您购买数字收藏品后，数字收藏品所对应的包括购买者信息的区块链登记将计入您的账号并在我们运行和维护的【数字收藏品权证登记链】进行登记，作为您持有该数字收藏品的凭证，以实现您对数字收藏品权利登记的不可篡改性和唯一性。您理解和同意，为了进行前述购买和登记，您的邮箱可能会被公开。此外，数字收藏品在区块链登记可能有一定延迟，您无法在购买后即时查看数字收藏品的区块链登记。在您购买数字收藏品并完成登记后，您可通过您的账号登录本平台查看该数字收藏品的区块链登记权利凭证，但您无权要求提取该区块链登记权利凭证或将区块链登记权利凭证转入您的其他电子钱包，亦无权要求我们将该数字收藏品或其区块链登记权利凭证导入至其他平台或在任何其他平台或机构对您的数字收藏品进行登记。</p>
                <p>6.2对于您根据本协议、通过本平台购买的数字收藏品，权利人将授予您一项在版权有效期内的、非独占的、非排他的、不可分许可的、仅限个人非商业目的用途的收藏、使用和展示您所购买的数字收藏品的许可。</p>
                <p>6.3除本协议明确约定的内容以外，或者您另行取得著作权人及相关权利人书面授权，无论您通过本平台还是其他任何方式获得数字收藏品，我们和著作权人及相关权利人都不会授予您对数字收藏品的任何权利和许可（包括但不限于著作权）。</p>
                <p>6.4上文第6.2条授予的许可仅在您拥有数字收藏品的时间范围内适用。如果您注销账号或出于任何原因放弃您已购买的数字收藏品，上文第6.2条授予的许可将立即到期，而无需另行通知。</p>
                <p>6.5您不得，且不得允许任何第三方实施以下行为：</p>
                <p>（1）复制、分发、修改、改编、翻译数字收藏品，或以其他方式开发任何衍生作品；</p>
                <p>（2）将数字收藏品用于任何商业目的，包括但不限于用于电影、视频或任何其他形式的媒体、纸质或电子出版物（包括但不限于音视频出版物）的封底、封面、插画、内容、软件或移动应用、线上或线下广告、销售或促销，及其他任何形式的商业活动、广告宣传、数字收藏品推广等；</p>
                <p>（3）将数字收藏品用于或关联于任何违反国家法律法规、政策、社会公序良俗、色情淫秽、暴力残忍、非法言论、不道德和/或侵犯第三人合法权利、权益的用途、场景；</p>
                <p>（4）将数字收藏品（部分或全部）作为自身或其他第三方的商标、服务标记、标识、logo、原产地标识或其他商业标识；</p>
                <p>（5）试图为您所购买数字收藏品注册商标、版权或以其他方式获得额外的知识产权；</p>
                <p>（6）将数字收藏品存储在任何以共享、转让信息或内容为目的的平台、系统、互联网、共享硬盘或类似设备上，供他人免费或付费浏览、下载、调取。</p>
                <p>6.6您理解并同意，由于购买行为一经发生即会被详细地记录在区块链上，您在本平台购买数字收藏品的行为是不可撤销的，如您因认知错误、操作失误、第三方欺诈等原因购买数字收藏品，我们亦无法撤销或恢复，您应对您的购买行为承担全部责任。特别提醒您，本平台出售的数字收藏品不支持七天无理由退换。一旦您购买数字收藏品，您无权反悔要求退回、更换该数字收藏品或退款。</p>
                <p>6.7您理解并同意，您在本平台上购买数字收藏品的行为可能根据适用的法律法规产生一定的税费，您应当负责按时支付全部税费并承担未履行相关义务时可能产生的全部法律责任。您无权从您应向我们或者其他用户支付的款项中扣除税费等其他额外产生的费用。</p>
                <p>6.8如果您购买的数字收藏品包含第三方知识产权，您理解并同意，您无权在数字收藏品之外使用第三方知识产权，例如：销售、分销包含第三方知识产权的商品。您使用数字收藏品的权利可能受到第三方知识产权权利人的限制，您应当在我们向您书面通知此类限制时遵守的限制，否则，您应当承担全部可能产生的法律后果和责任。</p>
                <p>&nbsp;</p>
                <p>七、实物收藏品的数字证书之权利与限制</p>
                <p>7.1您理解并同意，您通过本平台获得的实物收藏品的数字证书，是登记在区块链上，基于区块链技术的加密性、不可篡改性和不可替代性，将区块链登记作为持有该（等）实物收藏品的凭证。</p>
                <p>7.2实物收藏品的数字证书本身不具有交换价值，仅为确权工具，不得用于炒作、场外交易和任何商业用途。如发现您的账号存在炒作实物收藏品的数字证书等异常行为、涉嫌违法违规或本协议禁止的行为，我们有权采取必要的限制措施，包含但不限于冻结您的账号等。</p>
                <p>7.3当实物收藏品的所有权发生转移时，实物收藏品的所有者可以在本平台申请该实物收藏品的数字证书的赠送，本平台在审核通过后将在合理时间内协助实物收藏品的持有者完成数字证书的转移。为防止炒作，您理解并同意，您在获得实物收藏品的数字证书需持有【180 】日方可赠送。</p>
                <p>7.4您理解并同意，鉴于区块链服务的特殊性，本平台有权随时关闭实物收藏品的数字证书的赠送功能。</p>
                <p>&nbsp;</p>
                <p>八、知识产权保护</p>
                <p>对于本平台的相关内容，我们将根据以下规则保护我们和您的知识产权：</p>
                <p>8.1除另有约定外，本平台的内容、代码、数据等所有元素的所有权和所有法律权利、以及其中所有知识产品（包括但不限于数字收藏品、系统、方法、信息、代码、软件、服务、组织、内容、数据、技术、程序、网页、文字、图片、图表、外观、外观设计、简报、应用程序，和所有其他元素的汇编）的知识产权及本平台上相关数据的权利均属于我们所有。未经我们事先书面许可，您不能进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现我们的源代码，不能出租、出借、修改、链接、汇编、发表、出版、转载、复制、拷贝、出售、转售、访问、爬取、建立镜像站点或者使用任何部分的内容、数据、代码和外观设计。</p>
                <p>8.2我们尊重您的知识产权。为了向您提供我们的服务（例如：展示您上传的文字、语音、图片、视频、图文等），您同意授予我们一项全球的、免费的、可转让、非独占和不可撤销的权利，在不侵犯您商业秘密和个人信息的前提下，使用您在使用我们的服务中向我们提供或生成的所有信息和数据。除此之外，除非获得了您的同意，我们不会擅自使用、修改、复制、公开传播、改变、散布、发行或公开发表您拥有知识产权的成果。</p>
                <p>8.3所有与本平台以及本平台内容相关的商标、服务标志、编号均为我们或我们许可方的专有财产。未经我们事先书面授权同意，您不得在世界任何国家和地区将本平台Logo等文字、图形及其组合，以及本平台的其他标识、商号、徽记、网站名称、服务名称、服务标记以任何方式展示、使用或申请注册商标、进行域名注册等，也不得实施向他人明示或暗示有权展示、使用、或其他有权处理上述标识的行为。如因您非法使用上述标识等给我们或他人造成损失的，由您承担全部法律责任。</p>
                <p>8.4您应尊重我们和第三方的知识产权和其他合法权利/权益，保证在使用本平台服务时上传的文字、图片、视频、软件以及表演等信息不侵犯任何第三方的知识产权、名誉权、姓名权、隐私权等合法权益，并保证在发生侵犯前述权益的违法事件时，保护我们及我们的雇员、股东、合作伙伴等免于因该等事件受到影响或损失。我们保留在您侵犯我们及/或其他第三方的合法权利/权益时终止向您提供服务并不退还任何款项的权利，您应自行承担全部赔偿责任，并且赔偿我们因此遭受的包括但不限于经济、企业商誉等损失</p>
                <p>8.5任何组织或个人认为本平台的内容侵犯其知识产权的，可通过contact@whileone.solutions向我们提出书面权利通知和侵权的初步证据，我们将在收到知识产权权利人合格通知后依法尽快处理。</p>
                <p>&nbsp;</p>
                <p>九、关于本平台</p>
                <p>9.1我们开发并按照本协议之约定授权您登录、使用Infty市场（ &ldquo;本平台&rdquo; ）。</p>
                <p>您可以通过手机、电脑等电子设备的浏览器以网页的形式直接从我们的官方网站使用本平台，同时，我们会不断丰富支持您使用本平台的终端设备、形式等。</p>
                <p>9.2如果您从未经我们授权的第三方网站登录与本平台名称相同的平台，我们无法保证该平台能够正常使用，并对因此给您造成的损失不负任何责任。</p>
                <p>9.3为了增进用户体验、完善服务内容，我们可能不断努力开发新的服务，并为您不时提供平台更新。</p>
                <p>9.4为了改善用户体验或提高服务安全性、保证功能的一致性等目的，我们有权对本平台进行更新，或者对本平台的部分功能效果、服务内容进行改变。</p>
                <p>9.5本平台可能会使用第三方软件或技术（包括本软件可能使用的开源代码和公共领域代码等，下同），这种使用已经获得合法授权。</p>
                <p>9.6本平台如果使用了第三方的软件或技术，我们将按照相关法规或约定，对相关的协议或其他文件，可能通过在本软件安装包特定文件夹中打包等形式进行展示，它们可能会以 &ldquo;软件使用许可协议&rdquo; &ldquo;授权协议&rdquo; &ldquo;开源代码许可证&rdquo; 或其他形式来表达。</p>
                <p>9.7前述相关协议或其他文件均是本协议不可分割的组成部分，与本协议具有同等的法律效力，您应当遵守这些要求。如果您没有遵守这些要求，该第三方或者国家机关可能会对您提起诉讼、进行罚款或采取其他制裁措施，并要求我们给予协助，您应当自行承担法律责任。</p>
                <p>&nbsp;</p>
                <p>十、赔偿</p>
                <p>因您违反本协议而导致的任何第三方向我们或我们的关联方提出的索赔或请求，您应当承担赔偿责任，包括但不限于诉讼费用、律师费用、差旅费用、和解金额、罚款或生效法律文书中规定的损害赔偿金额、软件使用费等，且您应为我们抗辩或消除影响，保护我们不受损害。</p>
                <p>&nbsp;</p>
                <p>十一、责任限制</p>
                <p>请您知晓并理解，在以下情形中，我们不对由此给您造成的任何损失或损害承担任何责任：</p>
                <p>11.1我们将尽力为您提供畅通无阻、连贯安全的网络服务，但网络服务可能受多种因素的影响，我们不能保证向您提供的服务是连续的、即时的、准确的，也不能随时预见和防范法律、技术以及其他风险，包括但不限于不可抗力、病毒、木马、黑客攻击、系统不稳定、第三方服务瑕疵、政府行为等原因可能导致的服务中断、数据丢失、钱包文件损坏以及其他的损失和风险。我们的服务内容将依现状提供，我们不作任何形式的有关服务内容的准确性、完整性、令人满意的品质、不侵权或适合某一特殊目的的保证。</p>
                <p>11.2数字收藏品购买的确认需要一定时间，且在某些情况下可能无法完成，例如硬件、软件或网络连接故障、恶意代码或计算机病毒、支付系统、权证登记系统故障导致购买无法完成。在任何情况下我们无需对上述事项向您或任何第三方承担责任。</p>
                <p>11.3我们保留随时修改、增减、取消、暂停、中断或终止提供本平台全部或部分服务而无需事先告知您的权利，亦无需对您和第三方承担任何责任。服务器如因系统维护或升级而需暂停服务时，我们将尽量事先公告。如因系统维护、升级而需暂停服务或因服务器故障、硬件故障、其他不可抗力因素而导致停止服务，于暂停服务期间造成的一切不便和资料、数据等遗失，我们将尽力挽救恢复；如确实无法恢复，我们不承担任何责任。</p>
                <p>11.4我们将尽可能地在服务中提供准确的信息。服务所涉及的数字收藏品图片、演示图和示意图仅供参考（图片为合成图、模拟演示图）。限于篇幅，本协议中所包含的信息（包括但不限于数字收藏品功能说明等）可能不完整，请以有关数字收藏品使用说明书的具体信息为准。我们不保证提供的服务和数字收藏品完全符合您的使用要求，或完全符合您的期望。我们保留随时更改数字收藏品的设计、规格的权利，而无需事先通知您。</p>
                <p>11.5对于您自本平台获得的他人的信息、内容、声明或者广告宣传等任何资讯，我们不负保证真实性、准确性、完整性以及合法性的责任。如果任何单位或者个人通过上述 &ldquo;信息&rdquo; 而进行任何行为，须自行甄别真伪和谨慎预防风险，否则，无论何种原因，我们不对任何非于本平台直接发生的交易和(或)行为承担任何直接、间接、附带或衍生的损失和责任。</p>
                <p>11.6我们不承担由于您提供信息而可能产生的任何责任，包括但不限于因您在没有获得授权的情形下使用信息，或因您提供信息包含错误、不准确、病毒、诽谤、中伤、侵权等著作权法、隐私和个人信息保护相关法律或其他任何法律所禁止的内容或其他内容而产生的任何责任。我们亦不对您提供的信息在任何情形下的丢失、删除、移除或传输失败承担任何责任，您应对其提供信息自行保留备份。我们保留随时删除或移除任何您提供信息的权利，而无需通知您，且不需承担任何责任。</p>
                <p>11.7您知悉并同意，数字收藏品的价值具有较大主观性，我们或任何第三方对数字收藏品目前及未来的价值均不作出任何承诺。您同意您将在不依赖我们服务的情况下独立评估数字收藏品的价格。区块链登记权利凭证本身并不具有内在价值，仅为数字收藏品的权利凭证，无法脱离数字收藏品单独购买，不得作为价值尺度或交易媒介使用用于购买其他资产，亦不得用于购买任何资产或单独与国家法币进行兑换。</p>
                <p>11.8我们的服务内容可能含有与第三方服务的链接或接入第三方提供的服务，这些第三方仅为您提供便利，不代表我们经营或参与经营这些服务，亦不代表您被授予访问或使用这些服务的许可，您应自担责任（包括但不限于遵守该第三方的使用条款）并自付费用访问这些服务，我们不对这些服务的内容和行为负责。对于您在本平台之外，与第三方发生的任何法律行为，包括但不限于与第三方的交易，由您与该第三方自行承担全部的责任，我们并不控制或支持此类交易，因此我们不承担任何责任。</p>
                <p>11.9由于我们提供的产品和服务具有一定的创新性，当前的法律、法规、部门规章等规范性行文件、监管政策可能随时发生变化并对我们提供的产品和服务产生重大影响。您知悉并同意，我们无法保证向您连续提供相关服务并维持您的数字收藏品的初始价格，我们可能会根据需要更新或调整我们的服务内容，甚至中止、终止向您提供全部或部分服务。您认可并同意，为了保障交易安全、合法、有序以及履行我们反洗钱的义务，我们有权对您的区块链地址进行安全查询。如发现存在欺诈等异常情形，或您存在违反法律法规或本协议约定等情形，我们有权对您采取屏蔽或者限制使用等必要措施。</p>
                <p>11.10由于我们提供的数字收藏品可能包含某些电视剧、电影、音乐、图片、视听作品等领域的片段，如果因为突发政策性要求导致全网范围内下架某部作品或某人的作品，本平台将按照政策要求下架与其相关的数字收藏品，您同意我们将不承担相关责任。下架后，您可能无法购买以及公开展示该等数字收藏品，但您已经购买的数字收藏品仍可以在您的个人中心查看。</p>
                <p>11.11您特此承认并接受：对于您因使用本服务而遭受的任何直接或间接的损失，包括但不限于由于服务内容或服务的延误、不准确、错误和遗漏而产生的任何损害、责任、请求、损失或费用，我们及我们的关联方不承担任何责任。</p>
                <p>&nbsp;</p>
                <p>十二、其他条款</p>
                <p>12.1您在使用我们的服务时，根据所涉及的服务内容，可能需要同时遵守其他协议或条款。本协议及其他协议或条款，共同构成我们与您之间关于使用我们的服务的完整协议。您仅在完全同意该完整协议的前提下，方可使用该有关的服务。</p>
                <p>12.2您和我们，即多伦多大学应用开发社，双方均是独立的主体，在任何情况下本协议不构成双方之间的代理、合伙、合营或雇佣关系。</p>
                <p>12.3本协议的解释权及相关服务的解释权归多伦多大学应用开发社所有。</p>
                <p>12.4本协议各标题仅供参考，不作为解释条款内容的依据。</p>
               </div>
               <div class="scrollable-div-text" v-if="$i18n.locale === 'en'">
                <p>Dear user (&ldquo;you&rdquo;):</p>
                <p>You are welcome to use the Infty market (including the official website of the Infty market http://infty.market, hereinafter referred to as "this platform"), which is operated by the University of Toronto Application Development Agency (hereinafter referred to as "we"). . This platform is a digital art collection that provides users to purchase, collect and display blockchain digital collectibles (registered on the blockchain, created by top artists in various fields, and limited-edition digital art collections. Hereinafter referred to as "digital collections" &rdquo;) platform. Please read the following terms carefully before using our services, and using our services indicates that you are aware of and accept these terms (hereinafter referred to as "this agreement"). If you do not accept these terms and conditions, please stop using our services immediately. </p>
                <p>Any minors under the age of 18 or those who do not have full capacity for civil conduct are not allowed to register an account or use the services we provide. </p>
                <p>&nbsp;</p>
                <p>I. The subject of the contract and the scope of the agreement</p>
                <p>1.1 Subject and scope of the agreement</p>
                <p>This agreement is an agreement between you and us regarding the use of this platform's services. </p>
                <p>The validity of the terms of this agreement applies to all products and services we provide. You should be bound by this agreement when you enjoy any service on this platform. The products and services under this agreement refer to the Internet products and services published by us, including but not limited to online media, Internet value-added, interactive entertainment, e-commerce, advertising, etc. , barrage, pictures, software, technical codes, etc.). </p>
                <p>1.2 Establishing prerequisites</p>
                <p>Digital collectibles are digital collectibles, and you hereby undertake and warrant that you will primarily use the digital collectibles on this platform as objects for collection, entertainment and gaming, not for investment, speculation or speculation; you Hereby promise and guarantee that you will mainly use the blockchain digital certificate of physical collectibles as a tool for anti-counterfeiting traceability, rather than for investment, speculation or speculation, and these commitments and guarantees will be the prerequisite for you to enter into this agreement with us . </p>
                <p>1.3 Disclaimer</p>
                <p>In order to allow you to better use the products and services we provide, please be sure to carefully read and fully understand the terms of this agreement, especially the terms of exemption or limitation of liability. The limitations and disclaimers in this agreement may be highlighted in bold to remind you. </p>
                <p>When you register/login to this platform, it is deemed that you have fully read and accepted all the terms of this agreement, and you agree that this agreement is legally binding on both you and us. </p>
                <p>1.4 Protocol Components</p>
                <p>Except as expressly provided in this agreement, for the products and services we publish and sold by copyright owners or other rights holders, we have the right to adopt a separate product and service agreement (hereinafter referred to as &ldquo;single product) on the basis of this agreement Agreement"), you must understand and confirm separately when using the relevant products or services. In the event of any conflict between the Single Product Agreement and this Agreement, the Single Product Agreement shall prevail. If you use the product or service, it is deemed to accept the relevant single product agreement. </p>
                <p>The content of this agreement also includes all the various rules, announcements or notices that we have published or may publish in the future, as well as the single product agreement that you agree to when using a particular product or service, the aforementioned rules, announcements, notices and single items Once published, the Product Agreement is an integral part of this Agreement and is legally binding on both you and us. </p>
                <p>1.5 Amendments to the Agreement</p>
                <p>We have the right to revise this agreement and/or various rules from time to time as needed (including but not limited to formulating new terms and revising existing terms). Announcement of changes will be made without separate notice to you. Once the revised agreement and rules are announced, they will take effect immediately or at a specific time specified in the announcement. If you continue to use our products or services after the above announcement is revised, it is deemed that you have read, understood and accepted the revised agreement and rules. If you do not agree to the revision, you should immediately stop using this platform. </p>
                <p>&nbsp;</p>
                <p>Second, account registration, use and security</p>
                <p>2.1 Registration Qualifications</p>
                <p>You confirm that you should be at least 18 years old and have full capacity for civil conduct before you can register to use this platform. If you are under the age of 18 or do not have full capacity for civil conduct, you should not use this platform, otherwise you and your legal guardian shall bear all the consequences arising therefrom in accordance with the law. </p>
                <p>2.2 Account registration</p>
                <p>You should use Conflux during registration to complete the registration. After you fill in the information as prompted on the registration page, read and agree to this agreement, and complete all the registration procedures, you can use the account we provided to you and become our user. Your account is the credential you use to log in, use our services, and purchase digital collectibles. However, please note that we only allow you to use this account for personal rather than commercial purposes. We reserve the ownership of the account and service data and records related to registration and use of the account, including but not limited to all registration, login, service logs, customer service records and related usage data. </p>
                <p>2.3 Account Information</p>
                <p>You should accurately provide and timely update your account information in accordance with the requirements of laws and regulations or the prompts on the corresponding pages to make it true, timely, complete and accurate. Responsible for validity and integrity. If the information you provide is wrong, inaccurate, outdated or incomplete, we may send you a notice of inquiry and/or request for correction, and you should cooperate in providing or updating relevant information and materials as required by us. Because the information you fill in is untrue, untimely, incomplete or inaccurate, you should assume that you cannot use our account (cannot register successfully, or the account is frozen or cancelled) or some functions are restricted during use consequences and losses. </p>
                <p>2.4 Nickname</p>
                <p>You can set a nickname for your account, and the nickname you set must not infringe or be suspected of infringing the legitimate rights and interests of others. Observe the following rules when setting a nickname:</p>
                <p>(1) Do not register with the real name, font size, stage name or pseudonym of party and state leaders or other social celebrities;</p>
                <p>(2) Not registered in the name of a state agency or other agency;</p>
                <p>(3) Do not register accounts with uncivilized and unhealthy names, or accounts with discriminatory, insulting, obscene words;</p>
                <p>(4) Do not register an account that is likely to cause ambiguity and cause misunderstanding by others;</p>
                <p>(5) Do not endanger national security, divulge state secrets, subvert state power, or undermine national unity;</p>
                <p>(6) The honor and interests of the country shall not be damaged, and the public interest shall not be damaged;</p>
                <p>(7) Do not incite ethnic hatred, ethnic discrimination, or destroy ethnic unity;</p>
                <p>(8) Do not undermine the national religious policy, promote cults and feudal superstitions;</p>
                <p>(9) Do not spread rumors, disrupt social order, and undermine social stability;</p>
                <p>(10) Not to spread obscenity, pornography, gambling, violence, murder, terror or instigate crime;</p>
                <p>(11) Do not insult or slander others or infringe on the legitimate rights and interests of others;</p>
                <p>(12) Must not violate the Constitution or laws and regulations;</p>
                <p>(13) shall not contain other content prohibited by laws and administrative regulations. </p>
                <p>If the nickname you set is suspected of infringing on the legitimate rights and interests of others or contains other content prohibited by laws and administrative regulations, we have the right to refuse or terminate the provision of some or all of the software services to you. We do not assume any responsibility for this, and you will be liable for any direct or indirect losses and adverse consequences arising therefrom. </p>
                <p>2.5 Prohibition of loan</p>
                <p>Your account is limited to your own use. Without our written consent, it is prohibited to give, borrow, rent, transfer, sell or otherwise permit others to use the account in any form. If we find or have reasonable grounds to believe that the user is not the initial registrant of the account, we have the right to temporarily or terminate the provision of services to the registered account, and have the right to cancel the account without taking legal responsibility for the user who registered the account. </p>
                <p>2.6 Prohibit malicious registration</p>
                <p>Malicious registration of accounts is prohibited, including but not limited to frequent and batch registration of accounts. If we find or have reasonable reasons to believe that you have maliciously registered an account, we have the right to reject your malicious registration or cancel the maliciously registered account. </p>
                <p>2.7 Account Safekeeping</p>
                <p>You must take good care of your account and not disclose your account to others under any circumstances. You need to ensure that you leave the platform in the correct steps after purchasing digital collectibles and using our services. You assume full legal responsibility for the activities you engage in in the name of your registered account, including but not limited to the purchase of digital collectibles on this platform, payment, information disclosure, information release, online clicks to agree or submit various rules and agreements, etc. all legal consequences that may arise. &nbsp; We do not assume any responsibility for the loss and consequences of account leakage caused by attack, fraud, theft, etc. on your account due to your behavior or other factors. &nbsp; If you find that others are using your account without authorization, you should notify us immediately, and we will assist you to freeze your account or perform other security settings. &nbsp; Please understand that it takes reasonable time for us to take action on your request, and we are not responsible for the consequences (including but not limited to any loss to you) that have been generated before taking action and caused by you. </p>
                <p>2.8 Real-name authentication</p>
                <p>In order for you to better use our services and ensure the security of your account, we may require you to complete real-name authentication and/or conduct a "know your customer" survey in accordance with relevant laws and regulations, and You are required to provide further relevant information. </p>
                <p>2.9 Account freezing and appeal</p>
                <p>We have the right to freeze your account (all or part of the permissions or functions) and notify you through appropriate means and channels if the following situations occur:</p>
                <p>(1) Violating this agreement, as well as the relevant rules, management specifications, service descriptions and other usage agreements/terms for the purchase, display and service of digital collectibles;</p>
                <p>(2) Violating the provisions of national laws, regulations, policies and legal documents;</p>
                <p>(3) You have been complained by others, and the other party has provided relevant evidence, but you have not provided contrary evidence as required by us;</p>
                <p>(4) Based on reasonable analysis, we judge that your account operation is abnormal, conduct suspicious transactions, or risk fraud or money laundering;</p>
                <p>(5) In order to protect the legitimate rights and interests of us and other users;</p>
                <p>(6) The state authority requires it. </p>
                <p>If your account is frozen, you will temporarily be unable to use your account to purchase digital collectibles until it is unfrozen. We have the right to delete relevant illegal content at any time without notice, and deal with the offending account according to the circumstances of the behavior, including but not limited to warning, deleting some or all subscribers, restricting or prohibiting the use of all or part of the functions, account ban or even cancellation , and has the right to announce the result of the handling according to the specific circumstances. </p>
                <p>You may apply to us to lift the above freeze through the appeal process. For the security of your account, you should cooperate and truthfully provide your identity certificate and related materials, as well as other information or documents requested by us, so that we can conduct verification and investigation. We have the right to decide whether to agree to your appeal request. </p>
                <p>&nbsp;</p>
                <p>Three, account cancellation</p>
                <p>You have the right to voluntarily cancel your account. You can contact us to cancel your account through the contact information provided on the "About Us" page of this platform (except as otherwise stipulated by laws and regulations or otherwise agreed in this policy) ). &nbsp; Once you cancel your account, you will not be able to log in to the original account to use the products and services we provide and will automatically give up your existing rights, so please operate with caution. &nbsp; After your account is cancelled voluntarily by you or forcibly cancelled due to violation of the agreement in Article 2 above, you may be responsible for the following consequences including but not limited to:</p>
                <p>3.1 Once the account is cancelled, you will not be able to log in and use the account, that is, you will no longer be able to log in, use, and continue to use all products and services of this platform with this account;</p>
                <p>3.2 Once the account is cancelled, all content, information, data, records and digital collectibles you have purchased under the products and services of this platform that you have logged in and used through the account will be frozen, including but not Limited to:</p>
                <p>(1) The digital certificate of the digital collectibles purchased by the account or the obtained physical collectibles;</p>
                <p>(2) Personal data (such as avatar, nickname, etc.) and binding information (such as binding mobile phone number, email, etc.) under the account, as well as your other personal information under the account. At the same time, you will no longer enjoy your rights to personal information as stipulated in the "Bibox Privacy Policy", unless otherwise stipulated by laws and regulations;</p>
                <p>(3) All content published by the account (for example: articles, pictures, comments, interactions, etc.);</p>
                <p>(4) All other content, information, data, records (such as collections, etc.) related to the account. </p>
                <p>3.3 You agree to give up the rights and future expected benefits that have been generated but not consumed by the account during the use of the platform's products and services by canceling the account. That is, once the account is cancelled, all your rights and interests under the account will be automatically cleared and voided, including but not limited to:</p>
                <p>(1) Your account balance that has not been withdrawn;</p>
                <p>(2) The future income rights and interests of the content you publish on this platform;</p>
                <p>(3) Your various rights and interests on this platform;</p>
                <p>(4) Other rights and interests that have been generated but not consumed or expected future income. </p>
                <p>3.4 Once your account is cancelled, it cannot be recovered, even if you apply to us again to register an account on this platform with the same mobile phone number after cancellation, the account will be a brand new user account at this time. Therefore, we kindly remind you to back up the content that needs to be backed up in advance before actively applying for cancellation, withdraw the balance that needs to be withdrawn first, make proper arrangements for other interests, and make a cancellation decision after careful consideration;</p >
                <p>3.5 Once the account is cancelled, the agreements, documents, etc. you have signed with us will be terminated accordingly (except those that have been agreed to continue to be effective or otherwise provided by laws and regulations);</p>
                <p>3.6 Other results due to account cancellation (possibly). </p>
                <p>&nbsp;</p>
                <p>four, our service</p>
                <p>4.1 Browse, follow, share and display digital collections</p>
                <p>In the process of browsing this platform, we provide you with information classification, keyword retrieval, screening, attention, display and other functions to better match your needs. You can browse, follow, share the digital collectibles you are interested in, and show others the digital collectibles you have purchased. </p>
                <p>4.2 Advertising and Marketing</p>
                <p>When you submit information (including but not limited to email address, phone number, name, etc.) on this platform, it is deemed that you agree to us or entrust a third-party advertiser to communicate with you by email, in-site letter, SMS, telephone, etc. Contact to send you newsletters, advertisements and other commercial pushes. </p>
                <p>You can unsubscribe from advertisements according to the unsubscribe method described in the commercial advertisement information, or you can contact us to cancel the advertisement push through the contact information provided on the "About Us" page of this platform, but not in any way without our permission Block and filter advertising information. </p>
                <p>4.3 Dispute Handling</p>
                <p>If there are quality problems or other disputes in the physical products you purchased through the platform, you can report to the platform, the platform will provide you with the contact information of the seller, and you will protect the rights of the seller. For digital collectibles you purchase through the platform, or if disputes arise during the use of our services, you may contact us for mediation, negotiation and resolution. You can also file a complaint with the relevant administrative department or file a lawsuit with the competent court agreed in this agreement. </p>
                <p>4.4 service upgrade</p>
                <p>In order to improve user experience and improve service content, we will improve, enhance and further develop the services of this platform. You understand and agree that we have the right to update the services of this platform without special notice to you, or to update the services of this platform. Some functions have been changed or restricted. </p>
                <p>4.5 For the goods (including digital collectibles) you purchase through this platform in accordance with this agreement, you will have the right to request a VAT invoice equal to the full price you actually paid, and initiate an invoicing request through the platform. The platform will feed back your billing request to the actual seller. You acknowledge and agree that the invoice will be issued by the actual seller. </p>
                <p>&nbsp;</p>
                <p>V. Specifications</p>
                <p>You have the right to enjoy the Internet technical services and information services provided by this platform, purchase and display digital collectibles through this platform, or obtain blockchain digital certificates for physical collectibles. Subject to your compliance with this Agreement, we grant you a limited, non-transferable, non-exclusive, revocable, non-commercial right to use the Platform for personal use only. In any event, our content and services are licensed for your personal use only and may not be sold or transferred. We reserve all rights not specifically granted herein. When you use our services, you must follow the following principles:</p>
                <p>5.1 You shall not produce, reproduce, publish, or disseminate information containing the following contents or engage in related behaviors, nor shall you facilitate the production, reproduction, distribution, dissemination of information containing the following contents or engage in related behaviors. The content described in this article refers to any content produced, uploaded, copied, published, or disseminated during your use of the services under this agreement, including but not limited to account avatar, nickname, evaluation and other information, or text, voice, picture, video, etc. , pictures and texts, etc. to send, reply or automatically reply to messages and related link pages, as well as other content generated by using the account or the services of this platform. </p>
                <p>(1) Those who oppose the basic principles established by the Constitution;</p>
                <p>(2) Endangering national security, divulging state secrets, subverting state power, and undermining national unity;</p>
                <p>(3) Damage to national honor and interests;</p>
                <p>(4) Distorting, vilifying, blaspheming, denying the deeds and spirits of heroes and martyrs, and infringing upon the names, portraits, reputation, and honor of heroes and martyrs by insulting, slandering or other means;</p>
                <p>(5) Advocating terrorism, extremism or inciting terrorist or extremist activities;</p>
                <p>(6) Inciting ethnic hatred, ethnic discrimination, or undermining ethnic unity;</p>
                <p>(7) Those who undermine the state's religious policy and promote cults and feudal superstitions;</p>
                <p>(8) Spreading rumors and disrupting economic and social order;</p>
                <p>(9) Spreading obscenity, pornography, gambling, violence, murder, terror or instigating crime;</p>
                <p>(10) Insulting or slandering others, infringing on their reputation, privacy and other legitimate rights and interests;</p>
                <p>(11) Violating the "seven bottom lines" requirements of the bottom line of laws and regulations, the bottom line of the socialist system, the bottom line of national interests, the bottom line of citizens' legitimate rights and interests, the bottom line of social public order, the bottom line of morality, and the bottom line of information authenticity. </p>
                <p>At the same time, you should prevent and resist the production, copying, and publishing of bad information containing the following content:</p>
                <p>(1) Exaggerated titles are used, and the content is seriously inconsistent with the title;</p>
                <p>(2) Hype up scandals, scandals, bad deeds, etc.;</p>
                <p>(3) Improper comments on natural disasters, major accidents and other disasters;</p>
                <p>(4) Sexually suggestive, sexually provocative, etc. that are easy to cause sexual associations;</p>
                <p>(5) Showing blood, horror, cruelty, etc. that cause physical and mental discomfort;</p>
                <p>(6) Inciting crowd discrimination, regional discrimination, etc.;</p>
                <p>(7) Promote vulgar, vulgar and kitsch content;</p>
                <p>(8) It may cause minors to imitate unsafe behaviors and behaviors that violate social morality, induce minors' bad habits, etc.;</p>
                <p>(9) Other content that adversely affects the network ecology. </p>
                <p>5.2 Do not use our services to engage in illegal and criminal activities, including secession, instigating others to commit crimes, infringing on computer security systems, interfering with or disrupting network services, etc., endangering national security, fraud, money laundering, and engaging in or financing other illegal and criminal activities or Acts that are detrimental to the public interest. </p>
                <p>5.3 Comply with this Agreement and all related agreements, regulations and procedures, and must also follow Internet-related procedures and practices. </p>
                <p>5.4 Do not use or conduct any behaviors that endanger computer network security using or against our services, including but not limited to:</p>
                <p>(1) Activities that endanger network security such as illegally intruding into other people's networks, interfering with the normal functions of other people's networks, stealing network data, etc.;</p>
                <p>(2) Provide programs and tools specially designed for intrusion into the network, interfering with the normal functions and protective measures of the network, stealing network data, and other endangering network security activities;</p>
                <p>(3) Provide technical support, advertising promotion, payment settlement and other assistance to others who are aware of their activities endangering network security;</p>
                <p>(4) Use unlicensed data or access unlicensed servers/accounts;</p>
                <p>(5) Unauthorized access to public computer networks or other people's computer systems and deletion, modification, and addition of stored information;</p>
                <p>(6) Without permission, attempt to probe, scan, test the weaknesses of the service system or network, or conduct other behaviors that undermine network security;</p>
                <p>(7) Attempts to interfere with or disrupt the normal operation of the service system or platform, intentionally spread malicious programs or viruses, and other behaviors that disrupt and interfere with normal network information services;</p>
                <p>(8) Forge TCP/IP packet names or partial names. </p>
                <p>5.5 Do not reverse engineer, disassemble, compile or otherwise attempt to discover the source code of this platform. </p>
                <p>5.6 Do not submit or publish false information; do not defraud, coerce, induce other users to follow, click on linked pages or share information; do not use robots or automated programs to create accounts or purchase digital collectibles in a false or fraudulent manner; Impersonate someone else, use someone else's email address to create an account or buy digital collectibles. </p>
                <p>5.7 Do not use any plug-ins, plug-ins, systems or third-party tools that are not authorized or licensed by us to interfere with, disrupt, modify or otherwise affect the normal operation of the Service. </p>
                <p>5.8 You should use your own legal funds to purchase digital collectibles. </p>
                <p>5.9 You must not purchase digital collectibles by illegal means, such as stealing credit cards or using other payment methods or mechanisms that you are not authorized to use; you must not obtain blockchain digital certificates for physical collectibles by illegal means, such as stealing others Physical collectibles owned or possessed, and a digital certificate based on that physical collectible. </p>
                <p>5.10 Your purchases should be based on real consumption and collection needs, not for investment or speculative purposes, and there must be no malicious purchase of digital collectibles, price manipulation or money laundering using digital collectibles that disrupt the normal platform order Behavior. Based on the need to maintain platform order and platform security, we can actively execute operations such as closing relevant orders when we find the above situation. </p>
                <p>5.11 Digital collectibles on this platform may not be used as general equivalents or proofs for the purchase of other assets. </p>
                <p>5.12 Do not purchase any other user accounts of this platform or digital collectibles sold by this platform outside this platform. If you purchase digital collectibles sold on this platform in other ways, you shall be responsible for the legal consequences arising therefrom. </p>
                <p>5.13 Digital collectibles shall not be split into shares for trading outside this platform, and digital collectibles shall not be traded through centralized bidding, call auction, continuous bidding, electronic matching, and market-making transactions. The digital certificates of physical collectibles shall not be traded or hyped outside this platform, and the digital certificates of physical collectibles shall not be traded through centralized bidding, collective bidding, continuous bidding, electronic matching, and market-making transactions. </p>
                <p>5.14 Please ensure that any content (including but not limited to avatar, name, account introduction, or text, pictures, audio, video, links, etc., or Other content generated from the use of the services of this platform) shall have legitimate rights and interests, and shall not infringe upon the patent, copyright, trademark and other intellectual property rights, reputation rights, privacy rights or any other legitimate rights and interests of us and our affiliated companies, or any other third party. , or engage in conduct that harms our interests or adversely affects us. If the content in your account has a rights dispute or violates the legitimate rights and interests of any third party, you shall bear all legal responsibilities. </p>
                <p>5.15 Unless you have complied with the other provisions of this Agreement or have obtained our prior permission, you shall not, for any purpose, engage in or assist others to engage in the following acts:</p>
                <p>(1) Download, copy, read, adopt, display, share, forward, disseminate, upload, publish, and distribute our service content;</p>
                <p>(2) Modify, edit, organize, arrange or otherwise interpret our service content;</p>
                <p>(3) Transfer, resell and lease our service content;</p>
                <p>(4) Using any form of identification method including but not limited to special logos, special codes, etc., by itself or assisting a third party to have adverse effects on the information content of our services, such as traffic, reading volume guidance, transfer, hijacking, etc. </p>
                <p>5.16 With our prior written permission, your sharing, forwarding and other behaviors of the information content of our related services should also comply with the following specifications:</p>
                <p>(1) For relevant data such as crawling, counting, and obtaining related search hot words, hit rate, classification, search volume, click-through rate, reading volume, etc., the above data shall not be used in any way without our prior written consent. Publicize, provide or disclose to any third party;</p>
                <p>(2) It is not allowed to make any changes to the source webpage of this platform, including but not limited to the homepage link, advertising system link and other entrances of this platform, nor to block the display of the source page of this platform in any form, Insertion, pop-up windows, etc. obstruct;</p>
                <p>(3) Safe, effective and strict measures should be taken to prevent our information from being illegally obtained by third parties in any form including but not limited to web crawler programs;</p>
                <p>(4) The relevant data content shall not be used for purposes beyond the scope of our written permission, for any form of sales and commercial use, or to disclose, provide or allow third parties to use it in any way;</p> p>
                <p>(5) The user's behavior of sharing or forwarding the information content of our related services to any third party shall also abide by other norms and standards we have formulated for this purpose. </p>
                <p>5.17 In order to protect data security, you shall not engage in or facilitate the following acts including but not limited to:</p>
                <p>(1) Collect, copy, store, use or transmit other user data without the explicit consent of other users, or without truthfully disclosing relevant information such as data usage and scope of use to other users, infringing on the legitimate rights and interests of other users ;</p>
                <p>(2) Use other users' personal information such as account numbers and nicknames for any purpose that is not authorized by the user and us;</p>
                <p>(3) Attempts to find, track, associate, mine, and obtain personal information such as user account numbers, mobile phone numbers, and dates of birth by reflection;</p>
                <p>(4) Capture any user's information or any information and data related to this service through various programs, software, etc.;</p>
                <p>(5) Use any third-party software, plug-ins, plug-ins, systems, etc. to view or obtain any relevant information, data, etc. of us and our partners or users contained in this service without our authorization;</p >
                <p>(6) Other acts that endanger data security. </p>
                <p>5.18 If you violate any of the above provisions when using our services, we can judge and deal with it at our own discretion, and require you to correct or take all necessary measures (including but not limited to deleting your uploaded content, suspending or terminating your use of this platform) , delete your digital collectible images and descriptions, confiscate all digital collectibles you have purchased) to mitigate the effects of your misconduct, and have the right to terminate the service to you at any time without any prior notice , and hold relevant responsibilities. &nbsp; If you violate any of the above provisions and have any legal consequences, you should independently assume all legal responsibilities in your own name, and if you cause our losses or cause us to be claimed by a third party, you should fully compensate us for all losses and expenses (including but not limited to various compensation fees, litigation agency fees and other reasonable expenses for this purpose)</p>
                <p>5.19 If you find that the content (including but not limited to pictures, videos, text works, etc.) posted by users on this platform infringes your prior rights, you can contact us at contact@whileone.solutions to report and provide corresponding After verification, we will take timely measures to stop the infringement. </p>
                <p>&nbsp;</p>
                <p>6. Rights and restrictions on digital collections</p>
                <p>6.1 You can purchase works created by top creators in various fields through this platform and registered on the blockchain. Based on the encryption, non-tampering and irreplaceability of blockchain technology, the blockchain is registered as a After obtaining and purchasing the digital collectibles whose only certificate of ownership is obtained and purchased in accordance with this agreement, your rights to the digital collectibles will be limited, and you can only list the digital collectibles in your collection, appreciation, Browse and show your digital collection to other users. The creator, creation and on-chain time, purchaser and other information in the metadata of digital collectibles cannot be tampered with once confirmed. It will be counted in your account and registered in the [Digital Collectibles Warrant Registration Chain] operated and maintained by us, as your certificate of holding the digital collectibles, so as to realize the immutability and uniqueness of your registration of the rights of digital collectibles sex. You understand and agree that your email address may be disclosed in order to make the aforementioned purchases and registrations. In addition, there may be a delay in the registration of digital collectibles on the blockchain, and you cannot view the blockchain registration of digital collectibles immediately after purchase. After you purchase a digital collectible and complete the registration, you can log in to this platform through your account to view the blockchain registration certificate of the digital collectible, but you have no right to request to extract the blockchain registration certificate or transfer the block The blockchain registration right certificate is transferred to your other e-wallets, and there is no right to require us to import the digital collectible or its blockchain registration right certificate to other platforms or register your digital collectibles on any other platform or institution. </p>
                <p>6.2 For the digital collectibles you purchased through this platform in accordance with this agreement, the right holder will grant you a non-exclusive, non-exclusive, non-sublicensable, personal non-commercial purpose only within the validity period of the copyright A license to collect, use and display the digital collectibles you have purchased. </p>
                <p>6.3 Except for the content expressly stipulated in this agreement, or you have obtained the written authorization of the copyright owner and related rights holders, no matter you obtain digital collectibles through this platform or any other means, neither we nor the copyright holders and relevant rights holders will You are granted any rights and licenses (including, but not limited to, copyright) in digital collectibles. </p>
                <p>6.4 The license granted in clause 6.2 above applies only for the time frame in which you own the Digital Collection. If you cancel your account or for any reason abandon your purchased digital collectibles, the license granted in Section 6.2 above will expire immediately without notice. </p>
                <p>6.5 You shall not, and shall not allow any third party to: </p>
                <p>(1) reproduce, distribute, modify, adapt, translate the Digital Collectibles, or otherwise develop any derivative works;</p>
                <p>(2) Use the digital collection for any commercial purpose, including but not limited to use as the back cover of a film, video or any other form of media, paper or electronic publication (including but not limited to audiovisual publications) , covers, illustrations, content, software or mobile applications, online or offline advertising, sales or promotions, and any other form of commercial activity, advertising, promotion of digital collectibles, etc.;</p>
                <p>(3) Use or associate digital collections for any purpose that violates national laws, regulations, policies, social order and good customs, pornography, obscenity, violence and cruelty, illegal speech, immorality and/or violation of the legal rights and interests of third parties , scene;</p>
                <p>(4) Use the digital collection (in part or in whole) as its own or other third party's trademark, service mark, logo, logo, designation of origin or other commercial designation;</p>
                <p>(5) Attempt to trademark, copyright, or otherwise acquire additional intellectual property rights for the digital collectible you purchased;</p>
                <p>(6) Store digital collections on any platform, system, Internet, shared hard disk or similar device for the purpose of sharing or transferring information or content, for others to browse, download and retrieve for free or for a fee. </p>
                <p>6.6 You understand and agree that since the purchase will be recorded in detail on the blockchain once it occurs, your purchase of digital collectibles on this platform is irrevocable. , third-party fraud and other reasons to purchase digital collectibles, we cannot revoke or restore them, and you should be fully responsible for your purchases. We especially remind you that digital collectibles sold on this platform do not support seven-day returns without reason. Once you have purchased a digital collectible, you have no right to withdraw, request a return, exchange or refund the digital collectible. </p>
                <p>6.7 You understand and agree that your purchase of digital collectibles on this platform may generate certain taxes and fees according to applicable laws and regulations, and you should be responsible for paying all taxes and fees on time and for the failure to perform relevant obligations that may arise full legal responsibility. You are not entitled to deduct other additional charges, such as taxes, from payments you owe us or other users. </p>
                <p>6.8 If the digital collectibles you purchase contain third-party intellectual property rights, you understand and agree that you have no right to use third-party intellectual property rights outside of the digital collectibles, such as selling and distributing goods containing third-party intellectual property rights. Your right to use digital collections may be restricted by third-party intellectual property rights holders, and you should comply with the restrictions when we notify you in writing of such restrictions, otherwise, you should bear all possible legal consequences and responsibilities. </p>
                <p>&nbsp;</p>
                <p>7. Rights and limitations of digital certificates for physical collections</p>
                <p>7.1 You understand and agree that the digital certificates of physical collectibles you obtain through this platform are registered on the blockchain. Based on the encryption, non-tampering and irreplaceability of blockchain technology, the blockchain Chain registration acts as a certificate of holding the physical collectible(s). </p>
                <p>7.2 The digital certificate of physical collectibles does not have exchange value, but is only a tool for right confirmation, and shall not be used for speculation, over-the-counter transactions and any commercial purposes. If we find that your account has abnormal behaviors such as digital certificates for hyping physical collectibles, suspected violations of laws or regulations, or behaviors prohibited by this agreement, we have the right to take necessary restrictive measures, including but not limited to freezing your account. </p>
                <p>7.3 When the ownership of the physical collection is transferred, the owner of the physical collection can apply for the gift of the digital certificate of the physical collection on this platform, and the platform will assist the physical collection within a reasonable time after the review and approval. The holder completes the transfer of the digital certificate. In order to prevent speculation, you understand and agree that you need to hold [180] days before you can give away the digital certificate of the physical collection. </p>
                <p>7.4 You understand and agree that, in view of the particularity of blockchain services, this platform reserves the right to close the gift function of digital certificates for physical collectibles at any time. </p>
                <p>&nbsp;</p>
                <p>8, intellectual property protection</p>
                <p>For the content of this platform, we will protect our and your intellectual property rights according to the following rules:</p>
                <p>8.1 Unless otherwise agreed, the ownership and all legal rights of all elements such as the content, code, data, etc. of this platform, as well as all intellectual products therein (including but not limited to digital collectibles, systems, methods, information, codes, intellectual property rights in software, services, organization, content, data, technology, programs, web pages, text, pictures, graphics, appearance, designs, presentations, applications, and all other elements) and related data rights on the Platform All belong to us. You may not reverse engineer, disassemble, decompile, or otherwise attempt to discover our source code, rent, lend, modify, link, assemble, publish, publish, reprint, Copy, copy, sell, resell, access, scrape, mirror or use any part of the content, data, code and design. </p>
                <p>8.2 We respect your intellectual property rights. In order to provide you with our services (for example: to display your uploaded text, voice, pictures, videos, graphics, etc.), you agree to grant us a worldwide, free, transferable, non-exclusive and irrevocable right, Use all information and data you provide or generate to us in the use of our services, provided that it does not infringe on your trade secrets and personal information. In addition, we will not use, modify, reproduce, publicly transmit, alter, distribute, distribute or publicly publish your intellectual property rights unless we have obtained your consent. </p>
                <p>8.3 All trademarks, service marks and numbers related to this platform and its content are the exclusive property of us or our licensors. Without our prior written authorization and consent, you are not allowed to use the logo and other words, graphics and combinations of this platform, as well as other logos, trade names, emblems, website names, service names, service marks of this platform in any way in any country or region in the world. Display, use or apply for registered trademarks, register domain names, etc., and do not express or imply to others the right to display, use, or otherwise have the right to deal with the above marks. If you cause losses to us or others due to your illegal use of the above logos, you shall bear all legal responsibilities. </p>
                <p>8.4 You should respect the intellectual property rights and other legal rights/interests of us and third parties, and ensure that the text, pictures, videos, software, performances and other information uploaded when using the services of this platform do not infringe the intellectual property rights of any third party, Reputation rights, name rights, privacy rights and other legitimate rights and interests, and ensure that in the event of illegal events that violate the aforementioned rights and interests, we and our employees, shareholders, partners, etc. will be protected from being affected or lost due to such events. We reserve the right to terminate the service to you without refunding any payment if you violate the legal rights/interests of us and/or other third parties, and you shall be solely responsible for all indemnity and compensation we suffer as a result, including but not limited to economic , corporate goodwill and other losses</p>
                <p>8.5 Any organization or individual who believes that the content of this platform infringes its intellectual property rights can submit a written notice of rights and preliminary evidence of infringement to us at contact@whileone.solutions, and we will receive a qualified notice from the intellectual property rights owner after receiving a qualified notice. deal with it as soon as possible. </p>
                <p>&nbsp;</p>
                <p>9. About this platform</p>
                <p>9.1 We develop and authorize you to log in and use the Infty market ( &ldquo;this platform&rdquo; ) in accordance with the terms of this agreement. </p>
                <p>You can use this platform directly from our official website in the form of web pages through the browsers of mobile phones, computers and other electronic devices. At the same time, we will continue to enrich the terminal equipment and forms that support your use of this platform. </p>
                <p>9.2 If you log in to a platform with the same name as this platform from a third-party website that is not authorized by us, we cannot guarantee that the platform can be used normally, and will not be responsible for any losses caused to you. </p>
                <p>9.3 In order to enhance user experience and improve service content, we may continuously strive to develop new services and provide you with platform updates from time to time. </p>
                <p>9.4 For the purpose of improving user experience or improving service security, ensuring the consistency of functions, etc., we have the right to update this platform, or change some of the functional effects and service contents of this platform. </p>
                <p>9.5 This platform may use third-party software or technology (including open source code and public domain code that may be used by this software, the same below), and this use has been legally authorized. </p>
                <p>9.6 If this platform uses third-party software or technology, we will display relevant agreements or other documents in accordance with relevant regulations or agreements, possibly by packaging them in specific folders of this software installation package. It may be expressed in the form of "Software License Agreement"; "License Agreement"; "Open Source Code License" or other forms. </p>
                <p>9.7 The aforementioned relevant agreements or other documents are an integral part of this agreement and have the same legal effect as this agreement, and you should abide by these requirements. If you fail to comply with these requirements, the third party or state authority may sue you, impose fines or take other sanction measures, and require us to assist you, and you should bear the legal responsibility yourself. </p>
                <p>&nbsp;</p>
                <p>10. Compensation</p>
                <p>You shall be liable for any claims or demands made by any third party against us or our affiliates due to your breach of this Agreement, including but not limited to litigation costs, attorney fees, travel expenses, settlement amount, fines or the amount of damages, software royalties, etc. stipulated in effective legal documents, and you should defend or eliminate the impact for us and protect us from damage. </p>
                <p>&nbsp;</p>
                <p>11. Limitation of Liability</p>
                <p>Please know and understand that we are not responsible for any loss or damage caused to you in the following cases:</p>
                <p>11.1 We will try our best to provide you with unobstructed, consistent and secure network services, but network services may be affected by many factors, we cannot guarantee that the services provided to you are continuous, real-time, accurate, nor can To foresee and prevent legal, technical and other risks at any time, including but not limited to force majeure, viruses, Trojan horses, hacker attacks, system instability, third-party service defects, government actions and other reasons that may result in service interruption, data loss, wallet file damage and other losses and risks. Our service content will be provided on an as-is basis, and we do not make any form of guarantee regarding the accuracy, completeness, satisfactory quality, non-infringement or suitability for a particular purpose of the service content. </p>
                <p>11.2 Confirmation of the purchase of digital collectibles takes a certain amount of time and may not be completed in some cases, such as hardware, software or network connection failure, malicious code or computer virus, payment system, and warrant registration system failures that prevent the purchase from being completed . In no event shall we be liable to you or any third party for the above. </p>
                <p>11.3 We reserve the right to modify, increase or decrease, cancel, suspend, interrupt or terminate the provision of all or part of the services of this platform at any time without prior notice to you and without any responsibility to you and third parties. If the server needs to be suspended due to system maintenance or upgrade, we will try our best to announce it in advance. If the service needs to be suspended due to system maintenance or upgrade, or the service is suspended due to server failure, hardware failure, or other force majeure factors, we will try our best to save and restore any inconvenience and data, data, etc. caused during the suspension period. recovery, we do not assume any responsibility. </p>
                <p>11.4 We will try to provide accurate information in the Services. The pictures, demonstration pictures and schematic diagrams of digital collectibles involved in the service are for reference only (the pictures are composite pictures and simulated demonstration pictures). Due to space limitations, the information contained in this agreement (including but not limited to functional descriptions of digital collectibles, etc.) may not be complete, please refer to the specific information on the instruction manual of digital collectibles. We do not guarantee that the services and digital collectibles provided will fully meet your usage requirements, or fully meet your expectations. We reserve the right to change the design, specifications of digital collectibles at any time without prior notice to you. </p>
                <p>11.5 We are not responsible for the authenticity, accuracy, completeness and legality of any information you obtain from this platform, such as information, content, statements or advertisements of others. If any unit or individual conducts any behavior through the above "information", it must identify the authenticity and carefully prevent risks. Otherwise, for whatever reason, we will not accept any transaction and (or) behavior that is not directly related to this platform. assume any direct, indirect, incidental or consequential loss and liability. </p>
                <p>11.6 We do not assume any liability that may arise from the information you provide, including but not limited to the use of the information without authorization, or the information you provide contains errors, inaccuracies, viruses, defamation, slander , infringement and other copyright laws, privacy and personal information protection laws or any other laws prohibited content or any liability arising from any other content. We are also not responsible for the loss, deletion, removal or failure of transmission of the information you provide under any circumstances, and you should keep backup copies of the information you provide. We reserve the right to delete or remove any information you provide at any time without notice to you and without liability. </p>
                <p>11.7 You acknowledge and agree that the value of digital collectibles is highly subjective, and neither we nor any third party make any commitment to the current and future value of digital collectibles. You agree that you will independently assess the price of digital collectibles without reliance on our services. The blockchain registration certificate itself has no intrinsic value. It is only the certificate of rights for digital collectibles. It cannot be purchased separately from digital collectibles. Assets can be exchanged with national fiat currency separately. </p>
                <p>11.8 Our service content may contain links to third-party services or access to services provided by third parties. These third parties are only for your convenience and do not mean that we operate or participate in the operation of these services, or that you are authorized to License to access or use these services at your own responsibility (including but not limited to compliance with such third party's terms of use) and at your own expense to access these services, and we are not responsible for the content and conduct of those services. You and the third party are solely responsible for any legal actions you have with a third party outside this platform, including but not limited to transactions with third parties, and we do not control or support such transactions, therefore We do not take any responsibility. </p>
                <p>11.9 Due to the innovative nature of the products and services we provide, current laws, regulations, departmental rules and other normative documents and regulatory policies may change at any time and have a significant impact on the products and services we provide. You know and agree that we cannot guarantee the continuous provision of relevant services to you and maintain the initial price of your digital collectibles, and we may update or adjust our service content as necessary, or even suspend or terminate the provision of all or part of the services to you. You acknowledge and agree that in order to ensure the safety, legality and order of transactions and to fulfill our anti-money laundering obligations, we have the right to conduct security queries on your blockchain address. If we find that there is an abnormal situation such as fraud, or you have violated laws and regulations or this agreement, we have the right to take necessary measures such as shielding or restricting your use. </p>
                <p>11.10 Since the digital collections we provide may contain clips from certain TV series, movies, music, pictures, audio-visual works, etc., if a certain work or someone is removed from the shelves due to sudden policy requirements , this platform will remove the related digital collectibles in accordance with the policy requirements, and you agree that we will not be responsible for it. After removal, you may not be able to purchase and publicly display these digital collectibles, but the digital collectibles you have purchased can still be viewed in your personal center. </p>
                <p>11.11 You hereby acknowledge and accept: For any direct or indirect loss suffered by you as a result of your use of the Service, including but not limited to any damages arising from service content or service delays, inaccuracies, errors and omissions, We and our Affiliates shall not be liable for any liability, claim, loss or expense. </p>
                <p>&nbsp;</p>
                <p>12. Other Terms</p>
                <p>12.1 When you use our services, you may need to comply with other agreements or terms depending on the content of the services involved. This agreement and other agreements or terms together constitute the entire agreement between us and you regarding the use of our services. You can only use the related services on the premise of fully agreeing to the complete agreement. </p>
                <p>12.2 You and us, the University of Toronto Application Development Agency, are independent entities, and this Agreement does not constitute an agency, partnership, joint venture or employment relationship between the parties under any circumstances. </p>
                <p>12.3 The right to interpret this agreement and related services belongs to the University of Toronto Application Development Agency. </p>
                <p>12.4 The headings of this agreement are for reference only and shall not be used as the basis for interpreting the contents of the terms. </p>
               </div>
            </div>
            <input type="checkbox" id="terms" v-model="checkedTerms">
            <label for="terms" class="termsLabel">{{ $t("agree") }}</label>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main";
import { Notification } from "element-ui";

export default {
    name: "Navbar",
    props: ["activeIndex"],
    data: () => ({
        firstName: "",
        lastName: "",
        checkedTerms: false,
    }),
    methods: {
        connectWallet() {
            this.$store.dispatch("connectWallet");
        },
        async handleRegister() {
            if (this.firstName && this.checkedTerms) {
                this.$notify({
                    title: "Pending",
                    dangerouslyUseHTMLString: true,
                    message:
                        '<div style="display:flex; align-items: center;"> <div class="loader"></div><div style="display:inline">Creating your profile</div></div>',
                    duration: 0,
                });
                await axios
                    .post(`${this.$store.getters.getApiUrl}/profile/update-profile`, {
                        first_name: this.firstName,
                        last_name: this.lastName,
                        address: this.$store.getters.getAddress,
                    })
                    .then((res) => {
                        console.log("profile saved", res);
                        this.connectWallet();
                        Notification.closeAll();
                        this.$notify({
                            title: "Success",
                            message: "Profile created",
                            duration: 3000,
                        });
                    });
            } else {
                this.$notify.error({
                    title: "Error",
                    dangerouslyUseHTMLString: true,
                    message:
                        'You must fill in your first name and accept our Terms & Conditions.',
                    duration: 3000,
                });
            }
        },
        toProfile() {
            const path = this.$route.path;
            if (path.includes("profile") && path.split("profile/")[1] != this.$store.getters.getAddress) {
                window.location.pathname = `/profile/${this.$store.getters.getAddress}`;
            } else {
                this.$router.push(`/profile/${this.$store.getters.getAddress}`);
            }
        },
    },
    computed: {
        profilePicture: function() {
            return this.$store.getters.getProfilePic;
        },
    },
    async created() {
        // this will be registered multiple times since navbar will be created multiple times
        // needs fix
        eventBus.$on("Navbar.noProfile", () => {
            this.$refs["reg-modal"].show();
        });
        eventBus.$on("Navbar.noWallet", () => {
            this.$notify.info({
                title: "Wallet not Detected",
                dangerouslyUseHTMLString: true,
                message: `<a href="https://fluentwallet.com/" target="_blank">Please install it here</a>`,
                duration: 0,
            });
        });
    },
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap");
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px 10%;
    background-color: rgb(18, 18, 18);
}

.scrollable-div-text {
    font-size: small;
}

.logo {
    margin-right: auto;
}

.logo-img {
    cursor: pointer;
    width: 70px;
}

.nav__links a,
.overlay__content a {
    font-family: "Montserrat", sans-serif;
    font-weight: 500;
    font-size: 1.2rem;
    color: #edf0f1;
    text-decoration: none;
    cursor: pointer;
}

.nav__links {
    list-style: none;
    display: flex;
    align-items: center;
}

.nav__links li {
    padding: 0px 20px;
    cursor: pointer;
}

.nav__links li a {
    transition: color 0.3s ease 0s;
}

.nav__links li a:hover {
    color: #0088a9;
}

.wallet-btn {
    margin-left: 15px;
}

.active {
    border-bottom: 2px solid #0088a9;
}

.profile-pic {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    object-fit: cover;
    transition: all 0.4s ease;
}
.profile-pic:hover {
    transform: scale(1.1);
}

.scrollable-div {
    height: 100px;
    overflow-y: scroll;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    padding-left: 0.75rem;
    font-weight: 400;
    line-height: 1.2;
    font-size: 1rem;
    text-align: justify;
    color: #495057;
}

.termsLabel {
    padding: 0.375rem 0.75rem;
}

</style>
