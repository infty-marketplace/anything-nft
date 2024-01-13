from dotenv import load_dotenv
from pathlib import Path
import os

dotenv_path = Path('../backend/.env')
load_dotenv(dotenv_path=dotenv_path)

PEMKEY = os.getenv("PEMKEY")
infty_login_xpath = '//*[@id="app"]/div/div[1]/header/nav/ul/li[4]/button'
infty_logo_xpath = '//*[@id="app"]/div/div[1]/header/div/a/img'
infty_avatar_xpath = '//*[@id="app"]/div/div[1]/header/nav/ul/li[4]/img'
infty_profileUser_xpath = '//*[@id="app"]/div/div[2]/h2'
infty_profileEdit_xpath = '//*[@id="app"]/div/div[3]/div[2]/div[2]/div/div/div[1]/div/i'
infty_profileFirst_xpath = '//*[@id="app"]/div/div[3]/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/div/input'
infty_profileLast_xpath = '//*[@id="app"]/div/div[3]/div[2]/div[2]/div/div/div[2]/div[2]/div[2]/div/input'
infty_profileBio_xpath = '//*[@id="app"]/div/div[3]/div[2]/div[2]/div/div/div[2]/div[3]/div[1]/div/textarea'
infty_profileNoteClose_xpath = '/html/body/div[2]/div/div[2]'

infty_marketplace_xpath = '//*[@id="app"]/div/div[1]/header/nav/ul/li[1]/a'
infty_marketSearch_xpath = '//*[@id="__BVID__41"]'
infty_marketSearchBtn_xpath = '//*[@id="search-bar"]/div/div/div'
infty_marketPaint_xpath = '//*[@id="__BVID__43"]/div/div[2]/div/div[2]/p/p[1]'
infty_marketPaintImg_xpath = '//*[@id="__BVID__43"]/div/div[2]/div/div[2]/img'
infty_nftDetails_xpath = '//*[@id="cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr-358"]/div[2]/div[1]/div/div/div/button'
infty_nftTestId_xpath = '//*[@id="collapse-2"]/p[2]'
infty_nftBuyBtn_xpath = '//*[@id="cfxtest:ace5gcmv1x118ts2tta4k83asp7sxrz566w4defuhr-358"]/div[2]/div[3]/div[2]/div/a'
infty_nftCommision_xpath = '//*[@id="__BVID__125"]'
infty_nftBuyConfirm_xpath = '//*[@id="__BVID__103___BV_modal_footer_"]/button[2]'
infty_marketCat_xpath = '//*[@id="sidebar"]/div/div[2]/div[2]/button'
infty_marketCatPaint_xpath = '//*[@id="category-selection"]/div[4]/div/label'
infty_marketApplyBtn_xpath = '//*[@id="price-apply-btn"]'

infty_createNFT_xpath = '//*[@id="app"]/div/div[1]/header/nav/ul/li[2]/a'
infty_createTitle_xpath = '//*[@id="__BVID__29"]'
infty_createBrowse_xpath = '//*[@id="app"]/div/div[2]/div[1]/div/div/div/button'
infty_createDescrp_xpath = '//*[@id="description"]'
infty_createLabelPaint_xpath = '//*[@id="app"]/div/div[2]/div[3]/div[4]/button'
infty_createBtn_xpath = '//*[@id="app"]/div/div[2]/div[4]/button[1]'
infty_createSuccess_xpath = '//div[@class="el-notification__content" and p[contains(text(), "NFT created successfully")]]'

infty_collections_xpath = '//*[@id="app"]/div/div[1]/header/nav/ul/li[3]/a'
infty_collectionsNFT_xpath = '//div[contains(p[@class="card-text card-detail"], "Test NFT  # 0001")]'

fluent_widget_url = 'chrome-extension://eokbbaidfgdndnljmffldfgjklpjkdoi/popup/notification.html#/'
fluent_create_xpath = '//*[@id="welcomeBtn"]'
fluent_pwd_xpath = '//*[@id="password"]'
fluent_confirmPwd_xpath = '//*[@id="confirmPassword"]'
fluent_submitPwd_xpath = '//*[@id="setPasswordFormBtn"]'
fluent_selectPem_xpath = '//*[@id="pKey"]'
fluent_pemField_xpath = '//*[@id="pk"]'
fluent_importPem_xpath = '//*[@id="importPrivateKeyBtn"]'
fluent_sigDropdown_xpath = '//*[@id="selectNetwork"]'
fluent_sigNextBtn_xpath = '//*[@id = "nextBtn"]'
fluent_sigConfirmBtn_xpath = '//*[@id="confirmBtn"]'
fluent_openNetwork_xpath = '//*[@id="openNetworkBtn"]'
fluent_showHideNetwork_xpath = '//*[@id="network-list"]/div[1]/div/div[3]/div/a'
fluent_checkHideNetwork_xpath = '//*[@id="hide-testnet"]/div'
fluent_backbtn_xpath = '//*[local-name() = "svg"]'
fluent_testNetbtn_xpath = '//*[@id="item-11"]/div[2]'
