package me.brandonmichael.forcast.controllers;

import me.brandonmichael.forcast.models.User;
import me.brandonmichael.forcast.models.Weather;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping(value = "")
public class ForecastController {

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String index() {
        // render location form
        return "forecast/index";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public String renderForcast(@RequestParam String longitude, @RequestParam String latitude, @RequestParam(value = "city", required = false) String city, Model model, HttpServletRequest request) {
        // feed posted location data into darkskys api
        RestTemplate restTemplate = new RestTemplate();
        Weather jsonWeather = restTemplate.getForObject("https://api.darksky.net/forecast/ab7f7203b8910e9396157c09cd76eabf/" + latitude + "," + longitude, Weather.class);
            Weather weather = new Weather(jsonWeather);

            HttpSession httpSession = request.getSession(false);

            User user = null;
            if (httpSession!=null) {
                user = (User) httpSession.getAttribute("user");

                if (user!=null) {
                    model.addAttribute("user", user);
                }
            }

            if (city!=null) {
                model.addAttribute("city", city);
            }

            model.addAttribute("weather", weather);
        return "forecast/weather-overview";
    }

}