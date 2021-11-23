/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"

#import <IQKeyboardManager/IQKeyboardManager.h>


static NSString *appKey = @"03e6e91d3eda866159962343";
#ifdef DEBUG
static BOOL isProduction = FALSE;
static NSString *channel = @"inHouse";
#else
static BOOL isProduction = TRUE;
static NSString *channel = @"Publish channel";
#endif

@implementation AppDelegate

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object: notification.userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler
{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }

  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }

  completionHandler();
}


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"react_native_mobx"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  // 开启键盘防遮挡输入框的功能
  [self setupIQKeyboardManager];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [RNSplashScreen show];
  
  // 注册JPush
  [self setupJPush:launchOptions];

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#pragma mark - 防止键盘遮挡输入框
- (void)setupIQKeyboardManager {
  // 获取类库的单例变量
  IQKeyboardManager *keyboardManager = [IQKeyboardManager sharedManager];
  // 控制整个功能是否启用
  keyboardManager.enable = true;
  // 控制点击背景是否收起键盘
  keyboardManager.shouldResignOnTouchOutside = YES;
  // 控制键盘上的工具条文字颜色是否用户自定义
  keyboardManager.shouldToolbarUsesTextFieldTintColor = YES;
  // 有多个输入框时，可以通过点击Toolbar 上的“前一个”“后一个”按钮来实现移动到不同的输入框
  keyboardManager.toolbarManageBehaviour = IQAutoToolbarBySubviews;
  // 控制是否显示键盘上的工具条
  keyboardManager.enableAutoToolbar = true;
  // 是否显示占位文字
  keyboardManager.shouldShowToolbarPlaceholder = YES;
  // 设置占位文字的字体
  keyboardManager.placeholderFont = [UIFont boldSystemFontOfSize:16];
  // 输入框距离键盘的距离
  keyboardManager.keyboardDistanceFromTextField = 60.0f;
}

#pragma mark - 注册激光推送
- (void)setupJPush:(NSDictionary *)launchOptions {
  //Required
  //notice: 3.0.0及以后版本注册可以这样写，也可以继续用之前的注册方式
  JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
  entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound;
  //Required
  if ([[UIDevice currentDevice].systemVersion floatValue] >= 10.0) {
    if (@available(iOS 10.0, *)) {
      entity.types = UNAuthorizationOptionAlert|UNAuthorizationOptionBadge|UNAuthorizationOptionSound;
    } else {
      // Fallback on earlier versions
    }
  }else if ([[UIDevice currentDevice].systemVersion floatValue] >= 8.0) {
    //可以添加自定义categories
    [JPUSHService registerForRemoteNotificationTypes:(UIUserNotificationTypeBadge |
                                                      UIUserNotificationTypeSound |
                                                      UIUserNotificationTypeAlert)
                                          categories:nil];
  }else {
    //categories 必须为nil
    [JPUSHService registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge |
                                                      UIRemoteNotificationTypeSound |
                                                      UIRemoteNotificationTypeAlert)
                                          categories:nil];
  }
  // 注册
  [JPUSHService setupWithOption:launchOptions
                         appKey:appKey
                        channel:channel
               apsForProduction:isProduction];
}


@end
