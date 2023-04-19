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

fluent_widget_url = 'chrome-extension://eokbbaidfgdndnljmffldfgjklpjkdoi/popup/notification.html#/'
fluent_create_xpath = '//*[@id="welcomeBtn"]'
fluent_pwd_xpath = '//*[@id="password"]'
fluent_confirmPwd_xpath = '//*[@id="confirmPassword"]'
fluent_submitPwd_xpath = '//*[@id="setPasswordFormBtn"]'
fluent_selectPem_xpath = '//*[@id="pKey"]'
fluent_pemField_xpath = '//*[@id="pk"]'
fluent_importPem_xpath = '//*[@id="importPrivateKeyBtn"]'
fluent_sigNextBtn_xpath = '//*[@id = "nextBtn"]'
fluent_sigConfirmBtn_xpath = '//*[@id="confirmBtn"]'
fluent_openNetwork_xpath = '//*[@id="openNetworkBtn"]'
fluent_showHideNetwork_xpath = '//*[@id="network-list"]/div[1]/div/div[3]/div/a'
fluent_checkHideNetwork_xpath = '//*[@id="hide-testnet"]/div'
fluent_backbtn_xpath = '//*[local-name() = "svg"]'
fluent_testNetbtn_xpath = '//*[@id="item-11"]/div[2]'
