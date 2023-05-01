import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import properties as props
import pyautogui as pg
import os
import pymongo


def wait_for_element_visible(driver, by, value, timeout):
    WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, value)))


def wait_for_element_Clickable(driver, by, value, timeout):
    WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((by, value)))


def wait_for_new_window(driver, timeout):
    WebDriverWait(driver, timeout).until(EC.new_window_is_opened)


if __name__ == "__main__":
    browser: str = 'chrome'
    path: str = 'chromedriver'

    options = ChromeOptions()
    options.add_experimental_option('detach', True)
    options.add_argument('--ignore-certificate-errors')
    options.add_argument('--ignore-ssl-errors')
    options.add_extension("./fluent/fluent.crx")
    # supress log messages in console
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    service = ChromeService(path)
    driver = webdriver.Chrome(service=service, options=options)

    driver.get('http://localhost:8080/')
    window_home = driver.window_handles[0]
    driver.switch_to.new_window('tab')
    driver.get(props.fluent_widget_url)

    # ===========CREATE WALLET START===========
    wait_for_element_visible(driver, By.XPATH, props.fluent_create_xpath, 20)
    driver.find_element(By.XPATH, props.fluent_create_xpath).click()
    driver.find_element(
        By.XPATH, props.fluent_pwd_xpath).send_keys("test12345")
    time.sleep(1)
    driver.find_element(
        By.XPATH, props.fluent_confirmPwd_xpath).send_keys("test12345")
    time.sleep(1)
    driver.find_element(By.XPATH, props.fluent_submitPwd_xpath).click()
    print("Create Wallet - ***SUCCESS**")
    # ===========CREATE WALLET END===========

    # ===========IMPORT PEMKEY START===========
    wait_for_element_visible(
        driver, By.XPATH, props.fluent_selectPem_xpath, 20)
    driver.find_element(By.XPATH, props.fluent_selectPem_xpath).click()
    wait_for_element_visible(driver, By.XPATH, props.fluent_pemField_xpath, 20)
    driver.find_element(
        By.XPATH, props.fluent_pemField_xpath).send_keys(props.PEMKEY)
    time.sleep(1)
    driver.find_element(By.XPATH, props.fluent_importPem_xpath).click()
    print("Import PemKey - ***SUCCESS**")
    # ===========IMPORT PEMKEY END===========

    # ===========SWITCH TESTNET START===========
    wait_for_element_visible(
        driver, By.XPATH, props.fluent_openNetwork_xpath, 20)
    driver.find_element(By.XPATH, props.fluent_openNetwork_xpath).click()
    time.sleep(1)
    driver.find_element(
        By.XPATH, props.fluent_showHideNetwork_xpath).click()
    time.sleep(1)
    driver.find_element(
        By.XPATH, props.fluent_checkHideNetwork_xpath).click()
    time.sleep(1)
    driver.find_element(
        By.XPATH, props.fluent_backbtn_xpath).click()
    wait_for_element_visible(
        driver, By.XPATH, props.fluent_openNetwork_xpath, 20)
    time.sleep(1)
    driver.find_element(By.XPATH, props.fluent_openNetwork_xpath).click()
    time.sleep(1)
    driver.find_element(
        By.XPATH, props.fluent_testNetbtn_xpath).click()
    time.sleep(1)
    driver.close()
    driver.switch_to.window(window_home)
    print("Switch Testnet - ***SUCCESS**")
    # ===========SWITCH TESTNET END===========

    window_home = driver.window_handles[0]
    wait_for_element_visible(driver, By.XPATH, props.infty_login_xpath, 20)
    driver.find_element(By.XPATH, props.infty_login_xpath).click()
    time.sleep(1)
    window_fluent = driver.window_handles[1]
    driver.switch_to.window(window_fluent)
    # ===========REQUEST SIGNATURE START===========
    wait_for_element_visible(
        driver, By.XPATH, props.fluent_sigNextBtn_xpath, 20)
    driver.find_element(By.XPATH, props.fluent_sigNextBtn_xpath).click()
    time.sleep(1)
    driver.find_element(By.XPATH, props.fluent_sigConfirmBtn_xpath).click()
    time.sleep(1)
    window_fluent_signature = driver.window_handles[1]
    driver.switch_to.window(window_fluent_signature)
    wait_for_element_visible(
        driver, By.XPATH, props.fluent_sigConfirmBtn_xpath, 20)
    driver.find_element(By.XPATH, props.fluent_sigConfirmBtn_xpath).click()
    print("Request Signature - ***SUCCESS**")
    # ===========REQUEST SIGNATURE END===========
    time.sleep(1)
    driver.switch_to.window(window_home)
    # Close success connected notification
    driver.find_element(By.XPATH, props.infty_profileNoteClose_xpath).click()

    # ===========CREATE NFT START===========
    wait_for_element_visible(driver, By.XPATH, props.infty_createNFT_xpath, 20)
    driver.find_element(By.XPATH, props.infty_createNFT_xpath).click()

    wait_for_element_visible(
        driver, By.XPATH, props.infty_createTitle_xpath, 20)
    driver.find_element(By.XPATH, props.infty_createTitle_xpath).send_keys(
        "Test NFT #0001")
    time.sleep(1)
    driver.find_element(By.XPATH, props.infty_createBrowse_xpath).click()
    pg.sleep(2)
    pg.typewrite(os.path.join(os.getcwd(), 'createNft.png'))
    pg.press('enter')
    pg.press('tab')
    pg.press('enter')
    time.sleep(1)
    driver.find_element(By.XPATH, props.infty_createDescrp_xpath).send_keys(
        "I'm very Yellow")
    time.sleep(1)
    driver.find_element(By.XPATH, props.infty_createLabelPaint_xpath).click()
    time.sleep(1)
    window_home = driver.window_handles[0]
    driver.find_element(By.XPATH, props.infty_createBtn_xpath).click()
    time.sleep(5)  # wait for create window to load
    window_fluent_create = driver.window_handles[1]
    driver.switch_to.window(window_fluent_create)
    wait_for_element_Clickable(
        driver, By.XPATH, props.fluent_sigConfirmBtn_xpath, 20)
    driver.find_element(By.XPATH, props.fluent_sigConfirmBtn_xpath).click()
    time.sleep(1)
    driver.switch_to.window(window_home)
    wait_for_element_visible(
        driver, By.XPATH, props.infty_createSuccess_xpath, 60)
    time.sleep(3)
    wait_for_element_visible(
        driver, By.XPATH, props.infty_collections_xpath, 20)
    driver.find_element(By.XPATH, props.infty_collections_xpath).click()
    time.sleep(2)
    if not driver.find_element(By.XPATH, props.infty_collectionsNFT_xpath):
        print("Create NFT - ***FAILED**")
    else:
        print("Create NFT - ***SUCCESS**")

    # ===========MARKETPALCE START===========
    # wait_for_element_visible(
    #     driver, By.XPATH, props.infty_marketplace_xpath, 20)
    # driver.find_element(By.XPATH, props.infty_marketplace_xpath).click()

    # ===========MARKETPALCE SEARCH START===========
    # wait_for_element_visible(
    #     driver, By.XPATH, props.infty_marketSearch_xpath, 20)
    # driver.find_element(
    #     By.XPATH, props.infty_marketSearch_xpath).send_keys("painting")
    # time.sleep(1)
    # driver.find_element(By.XPATH, props.infty_marketSearchBtn_xpath).click()
    # time.sleep(1)
    # if not driver.find_element(By.XPATH, props.infty_marketPaint_xpath):
    #     print("Marketplace Search - ***FAILED**")
    # else:
    #     print("Marketplace Search - ***SUCCESS**")
    # ===========MARKETPALCE SEARCH END===========

    # driver.find_element(
    #     By.XPATH, props.infty_marketSearch_xpath).clear()
    # time.sleep(1)
    # driver.find_element(By.XPATH, props.infty_marketSearchBtn_xpath).click()
    # time.sleep(1)

    # ===========MARKETPALCE FILTER START===========
    # wait_for_element_visible(driver, By.XPATH, props.infty_marketCat_xpath, 20)
    # driver.find_element(By.XPATH, props.infty_marketCat_xpath).click()
    # wait_for_element_visible(
    #     driver, By.XPATH, props.infty_marketCatPaint_xpath, 20)
    # driver.find_element(By.XPATH, props.infty_marketCatPaint_xpath).click()
    # time.sleep(1)
    # driver.find_element(By.XPATH, props.infty_marketApplyBtn_xpath).click()
    # time.sleep(1)
    # if not driver.find_element(By.XPATH, props.infty_marketPaint_xpath):
    #     print("Marketplace Filter - ***FAILED**")
    # else:
    #     print("Marketplace Filter - ***SUCCESS**")
    # ===========MARKETPALCE FILTER END===========

    # ===========MARKETPALCE NFT DETAIL START===========
    # driver.find_element(By.XPATH, props.infty_marketPaintImg_xpath).click()
    # time.sleep(1)
    # wait_for_element_visible(
    #     driver, By.XPATH, props.infty_nftDetails_xpath, 20)
    # driver.find_element(By.XPATH, props.infty_nftDetails_xpath).click()
    # time.sleep(1)
    # if not driver.find_element(By.XPATH, props.infty_nftTestId_xpath):
    #     print("Marketplace NFT Detail - ***FAILED**")
    # else:
    #     print("Marketplace NFT Detail - ***SUCCESS**")
    # ===========MARKETPALCE NFT DETAIL END===========

    # ===========MARKETPALCE NFT BUY START===========
    # driver.find_element(By.XPATH, props.infty_nftBuyBtn_xpath).click()
    # time.sleep(1)
    # window_home = driver.window_handles[0]
    # wait_for_element_visible(
    #     driver, By.XPATH, props.infty_nftCommision_xpath, 20)
    # driver.find_element(
    #     By.XPATH, props.infty_nftCommision_xpath).send_keys("0.25")
    # time.sleep(1)
    # driver.find_element(By.XPATH, props.infty_nftBuyConfirm_xpath).click()
    # time.sleep(1)
    # window_fluent_buy = driver.window_handles[1]
    # driver.switch_to.window(window_fluent_buy)
    # wait_for_element_visible(
    #     driver, By.XPATH, props.fluent_sigConfirmBtn_xpath, 20)
    # driver.find_element(By.XPATH, props.fluent_sigConfirmBtn_xpath).click()
    # time.sleep(1)
    # driver.switch_to.window(window_home)
    # ===========MARKETPALCE END===========

    # ===========UPDATE PROFILE START===========
    # wait_for_element_visible(driver, By.XPATH, props.infty_logo_xpath, 20)
    # driver.find_element(By.XPATH, props.infty_logo_xpath).click()
    # driver.find_element(By.XPATH, props.infty_avatar_xpath).click()
    # wait_for_element_visible(
    #     driver, By.XPATH, props.infty_profileEdit_xpath, 20)
    # driver.find_element(By.XPATH, props.infty_profileEdit_xpath).click()
    # firstname = driver.find_element(
    #     By.XPATH, props.infty_profileFirst_xpath)
    # lastname = driver.find_element(
    #     By.XPATH, props.infty_profileLast_xpath)
    # bio = driver.find_element(
    #     By.XPATH, props.infty_profileBio_xpath)
    # firstname.clear()
    # time.sleep(1)
    # firstname.send_keys('AUTOMATION2')
    # time.sleep(1)
    # lastname.clear()
    # time.sleep(1)
    # lastname.send_keys('AUTOMATION3')
    # time.sleep(1)
    # bio.clear()
    # time.sleep(1)
    # bio.send_keys('BIO AUTOMATION')
    # time.sleep(1)
    # driver.find_element(By.XPATH, props.infty_profileEdit_xpath).click()
    # print("Update Profile - ***SUCCESS**")
    # ===========UPDATE PROFILE END===========

    db = pymongo.MongoClient(
        "mongodb+srv://admin:admin@cluster0.q6hzh.mongodb.net/infty", useNewParser=True, useUnifiedTopology=True)
    # users = db.users
    # users.delete_many(
    #     {"address": 'cfxtest:aasr3dg9d0ej0cb5x720yj4651rsjcr0ap640rxmce'})

    nfts = db.nfts
    nfts.delete_many(
        {"author": 'cfxtest:aasr3dg9d0ej0cb5x720yj4651rsjcr0ap640rxmce'})
