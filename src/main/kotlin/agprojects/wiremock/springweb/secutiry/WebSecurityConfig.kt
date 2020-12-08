package agprojects.wiremock.springweb.secutiry

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

@Configuration
@EnableWebSecurity
class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.authorizeRequests().antMatchers("/api/**").authenticated()
        http.authorizeRequests().antMatchers("/h2/**").authenticated()
        http.authorizeRequests().antMatchers("/css/**", "/img/**", "/js/**").permitAll()

        http.cors().and().csrf().disable()
        http.headers().frameOptions().disable()

        http.authorizeRequests().anyRequest().authenticated()
                .and().formLogin().defaultSuccessUrl("/manager", true).loginPage("/login").permitAll()
                .and().logout().permitAll()
    }

}