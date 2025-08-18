
package com.weebysagar.myapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SharedDataModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SharedData"
    }

    @ReactMethod
    fun set(data: String, promise: Promise) {
        try {
            val sharedPreferences = reactApplicationContext.getSharedPreferences("news_widget_data", 0)
            val editor = sharedPreferences.edit()
            editor.putString("news_data", data)
            editor.apply()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("Error", e)
        }
    }
}
