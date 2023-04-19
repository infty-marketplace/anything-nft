import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
import properties as props


def wait_for_element_visible(driver, by, value, timeout):
    WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, value)))


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
    wait_for_element_visible(driver, By.XPATH, props.infty_login_xpath, 20)
    driver.find_element(By.XPATH, props.infty_login_xpath).click()
    time.sleep(1)
    window_fluent = driver.window_handles[1]
    driver.switch_to.window(window_fluent)

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

    # ===========SWITCH TESTNET START===========
    driver.switch_to.new_window('tab')
    driver.get(props.fluent_widget_url)
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
    driver.find_element(By.XPATH, props.fluent_openNetwork_xpath).click()
    time.sleep(1)
    driver.find_element(
        By.XPATH, props.fluent_testNetbtn_xpath).click()
    time.sleep(1)
    driver.close()
    driver.switch_to.window(window_home)
    print("Switch Testnet - ***SUCCESS**")
    # ===========SWITCH TESTNET END===========

    # ===========UPDATE PROFILE START===========
    wait_for_element_visible(driver, By.XPATH, props.infty_logo_xpath, 20)
    driver.find_element(By.XPATH, props.infty_logo_xpath).click()
    driver.find_element(By.XPATH, props.infty_avatar_xpath).click()
    wait_for_element_visible(
        driver, By.XPATH, props.infty_profileEdit_xpath, 20)
    driver.find_element(By.XPATH, props.infty_profileEdit_xpath).click()
    firstname = driver.find_element(
        By.XPATH, props.infty_profileFirst_xpath)
    lastname = driver.find_element(
        By.XPATH, props.infty_profileLast_xpath)
    bio = driver.find_element(
        By.XPATH, props.infty_profileBio_xpath)
    firstname.clear()
    time.sleep(1)
    firstname.send_keys('AUTOMATION2')
    time.sleep(1)
    lastname.clear()
    time.sleep(1)
    lastname.send_keys('AUTOMATION3')
    time.sleep(1)
    bio.clear()
    time.sleep(1)
    bio.send_keys('BIO AUTOMATION')
    time.sleep(1)
    driver.find_element(By.XPATH, props.infty_profileEdit_xpath).click()
    # ===========UPDATE PROFILE END===========

    # time.sleep(3)
    # print("===========CONFIG TESTNET START===========")
    # driver.find_element(
    #     By.XPATH, '//*[@id="openNetworkBtn"]').click()
    # driver.find_element(
    #     By.XPATH, '//*[@id="network-list"]/div[1]/div/div[3]/div/a').click()
    # driver.find_element(
    #     By.XPATH, '//*[@id="hide-testnet"]/div/svg').click()
    # driver.find_element(
    #     By.XPATH, '//*[@id="go-back"]/svg').click()
    # driver.find_element(
    #     By.XPATH, '//*[@id="openNetworkBtn"]').click()
    # driver.find_element(
    #     By.XPATH, '//*[@id="item-11"]').click()
    # print("===========CONFIG TESTNET END===========")
