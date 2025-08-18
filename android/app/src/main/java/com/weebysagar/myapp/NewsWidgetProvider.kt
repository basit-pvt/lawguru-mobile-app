
package com.weebysagar.myapp

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.graphics.Color
import android.net.Uri
import android.util.Log
import android.widget.RemoteViews
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.io.File

data class Article(val id: String, val title: String, val localImageUrl: String)

class NewsWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    private fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
        val views = RemoteViews(context.packageName, R.layout.news_widget)

        try {
            val sharedPreferences = context.getSharedPreferences("news_widget_data", Context.MODE_PRIVATE)
            val newsData = sharedPreferences.getString("news_data", null)

            if (newsData != null) {
                Log.d("NewsWidgetProvider", "Widget data found: $newsData")
                val type = object : TypeToken<Article>() {}.type
                val article: Article? = Gson().fromJson(newsData, type)

                if (article != null) {
                    views.setTextViewText(R.id.widget_title, article.title)

                    val imagePath = Uri.parse(article.localImageUrl).path
                    if (imagePath != null) {
                        val imageFile = File(imagePath)
                        if (imageFile.exists()) {
                            try {
                                val bmp = BitmapFactory.decodeFile(imageFile.absolutePath)
                                views.setImageViewBitmap(R.id.widget_image, bmp)
                                Log.d("NewsWidgetProvider", "Image loaded successfully from: ${imageFile.absolutePath}")
                            } catch (e: Exception) {
                                Log.e("NewsWidgetProvider", "Error decoding image", e)
                                views.setImageViewResource(R.id.widget_image, R.drawable.ic_launcher_background)
                                views.setInt(R.id.widget_layout, "setBackgroundColor", Color.parseColor("#6c757d"))
                            }
                        } else {
                            Log.e("NewsWidgetProvider", "Image file not found at: ${imageFile.absolutePath}")
                            views.setImageViewResource(R.id.widget_image, R.drawable.ic_launcher_background)
                            views.setInt(R.id.widget_layout, "setBackgroundColor", Color.parseColor("#6c757d"))
                        }
                    } else {
                        Log.e("NewsWidgetProvider", "Invalid image path")
                        views.setImageViewResource(R.id.widget_image, R.drawable.ic_launcher_background)
                        views.setInt(R.id.widget_layout, "setBackgroundColor", Color.parseColor("#6c757d"))
                    }

                    val intent = Intent(
                        Intent.ACTION_VIEW,
                        Uri.parse("myapp://news/${article.id}")
                    )
                    val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
                    views.setOnClickPendingIntent(R.id.widget_layout, pendingIntent)
                } else {
                     views.setTextViewText(R.id.widget_title, "No article available")
                     views.setInt(R.id.widget_layout, "setBackgroundColor", Color.parseColor("#6c757d"))
                }
            } else {
                Log.d("NewsWidgetProvider", "No widget data found in SharedPreferences")
                views.setTextViewText(R.id.widget_title, "No article available")
                views.setInt(R.id.widget_layout, "setBackgroundColor", Color.parseColor("#6c757d"))
            }
        } catch (e: Exception) {
            Log.e("NewsWidgetProvider", "Error reading widget data", e)
            views.setTextViewText(R.id.widget_title, "Error loading data")
            views.setInt(R.id.widget_layout, "setBackgroundColor", Color.parseColor("#6c757d"))
        }

        appWidgetManager.updateAppWidget(appWidgetId, views)
    }
}

