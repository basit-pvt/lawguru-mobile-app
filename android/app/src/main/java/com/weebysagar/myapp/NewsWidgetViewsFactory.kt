
package com.weebysagar.myapp

import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class NewsWidgetViewsFactory(private val context: Context, private val intent: Intent) : RemoteViewsService.RemoteViewsFactory {

    private var articles = JSONArray()

    override fun onCreate() {
        // Not needed
    }

    override fun onDataSetChanged() {
        try {
            val sharedPrefs = context.getSharedPreferences("user-preferences", Context.MODE_PRIVATE)
            val userPrefsJson = sharedPrefs.getString("user-preferences", null)
            var isLoggedIn = false
            var preferredCategories = emptyList<String>()

            if (userPrefsJson != null) {
                val prefs = JSONObject(userPrefsJson)
                isLoggedIn = prefs.getBoolean("isLoggedIn")
                val categoriesArray = prefs.getJSONArray("preferredCategories")
                for (i in 0 until categoriesArray.length()) {
                    preferredCategories = preferredCategories + categoriesArray.getString(i)
                }
            }

            val url = if (isLoggedIn && preferredCategories.isNotEmpty()) {
                URL("https://api.lawguru.com/news?categories=" + preferredCategories.joinToString(","))
            } else {
                URL("https://api.lawguru.com/news")
            }

            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connect()

            val inputStream = connection.inputStream
            val response = inputStream.bufferedReader().use { it.readText() }

            articles = JSONObject(response).getJSONArray("articles")

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        // Not needed
    }

    override fun getCount(): Int {
        return articles.length()
    }

    override fun getViewAt(position: Int): RemoteViews {
        val views = RemoteViews(context.packageName, R.layout.news_widget_item)
        val article = articles.getJSONObject(position)
        views.setTextViewText(R.id.widget_item_title, article.getString("title"))
        return views
    }

    override fun getLoadingView(): RemoteViews? {
        return null
    }

    override fun getViewTypeCount(): Int {
        return 1
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun hasStableIds(): Boolean {
        return true
    }
}
