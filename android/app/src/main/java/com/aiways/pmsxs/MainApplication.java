package com.aiways.pmsxs;

import android.app.Application;
 import com.github.wumke.RNExitApp.RNExitAppPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.facebook.react.ReactApplication;
import io.sentry.RNSentryPackage;
// import com.christopherdro.RNPrint.RNPrintPackage;
import com.jimmydaddy.imagemarker.ImageMarkerPackage;
import org.wonday.pdf.RCTPdfView;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.RNFetchBlob.RNFetchBlobPackage;

import java.util.Arrays;
import java.util.List;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.reactnativejpush.JPushPackage;


public class MainApplication extends Application implements ReactApplication {

  // 设置为 true 将弹出 toast
  private boolean SHUTDOWN_TOAST = true;
  // 设置为 true 将打印 log
  private boolean SHUTDOWN_LOG = true;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {

      return Arrays.<ReactPackage>asList(
            new RCTPdfView(),
            new RNHTMLtoPDFPackage(),
            new ReanimatedPackage(),
            new SplashScreenReactPackage(),
            new SvgPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNGestureHandlerPackage(),
            new PickerPackage(),
            new RNFetchBlobPackage(),
            new MainReactPackage(),
            new RNSentryPackage(),
            // new RNPrintPackage(),
            new ImageMarkerPackage(),
            new RNExitAppPackage(),
            new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    // 强烈建议在Application初始化时调用原生接口的init方法
    JPushInterface.init(this);
  }
}
