#ifndef CATEGORY_H
#define CATEGORY_H

#include <string>
#include <odb/core.hxx>

#pragma db object
class category
{
public:
    category(const std::string &username, const std::string &category_name) : username_(username), category_name_(category_name)
    {
    }

    const std::string &get_username() const
    {
        return username_;
    }
    void set_username(const std::string &username)
    {
        username_ = username;
    }

    const std::string &get_category_name() const
    {
        return category_name_;
    }
    void set_category_name(const std::string &category_name)
    {
        category_name_ = category_name;
    }

private:
    friend class odb::access;
    category() {}

#pragma db id auto
    unsigned long id_;

    std::string username_;
    std::string category_name_;
};

#endif // CATEGORY_H
